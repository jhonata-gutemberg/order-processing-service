import { beforeAll, describe, expect, it } from "vitest";
import { container } from "tsyringe";
import { DataSource } from "typeorm";
import TestAgent from "supertest/lib/agent";
import {
    CUSTOMER_REPOSITORY_TOKEN,
    DATA_SOURCE_TOKEN,
    PRODUCT_REPOSITORY_TOKEN,
    TEST_AGENT_TOKEN,
} from "@/infra/di/tokens";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities";
import { Product } from "@/domain/products/models/entities";
import { UUIDGenerator } from "@/domain/shared/generators";
import { OrderPersistenceModel } from "@/infra/typeorm/orders/models";

describe("OrderController", () => {
    let dataSource: DataSource;
    let request: TestAgent;
    let customerRepository: CustomerRepository;
    let productRepository: ProductRepository;

    beforeAll(() => {
        dataSource = container.resolve(DATA_SOURCE_TOKEN);
        request = container.resolve(TEST_AGENT_TOKEN);
        customerRepository = container.resolve(CUSTOMER_REPOSITORY_TOKEN);
        productRepository = container.resolve(PRODUCT_REPOSITORY_TOKEN);
    });

    describe("create", () => {
        it("should return 201 when order created and deduct stock", async () => {
            const customer = await Customer.create({
                name: "John Doe",
                email: "john.doe@email.com",
            });
            const persistedCustomer = await customerRepository.save(customer);
            const product1 = await Product.create({
                name: "Keyboard",
                price: 10,
                stock: 5,
            });
            const product2 = await Product.create({
                name: "Mouse",
                price: 5.5,
                stock: 10,
            });
            const persistedProduct1 = await productRepository.save(product1);
            const persistedProduct2 = await productRepository.save(product2);

            const res = await request
                .post("/orders")
                .send({
                    customerId: persistedCustomer.id,
                    items: [
                        { productId: persistedProduct1.id, quantity: 2 },
                        { productId: persistedProduct2.id, quantity: 3 },
                    ],
                })
                .expect(201);

            expect(res.body).toHaveProperty("id");
            expect(res.body).toMatchObject({
                customerId: persistedCustomer.id,
                total: 10 * 2 + 5.5 * 3,
            });
            expect(res.body.items).toHaveLength(2);
            const updated1 = await productRepository.findById(
                persistedProduct1.id,
            );
            const updated2 = await productRepository.findById(
                persistedProduct2.id,
            );
            expect(updated1?.stock).toBe(3);
            expect(updated2?.stock).toBe(7);
            const persistedOrder = await dataSource.manager.findOne(
                OrderPersistenceModel,
                {
                    where: { id: res.body.id },
                },
            );
            expect(persistedOrder).toBeInstanceOf(OrderPersistenceModel);
            expect(persistedOrder?.customerId).toBe(persistedCustomer.id);
            expect(persistedOrder?.total).toBe(10 * 2 + 5.5 * 3);
            expect(persistedOrder?.items).toHaveLength(2);
        });

        it("should return 404 when customer not found", async () => {
            const res = await request.post("/orders").send({
                customerId: UUIDGenerator.generate(),
                items: [{ productId: UUIDGenerator.generate(), quantity: 1 }],
            });

            expect(res.status).toBe(404);
        });

        it("should return 404 when product not found", async () => {
            const customer = await Customer.create({
                name: "John Doe",
                email: "john.doe@email.com",
            });
            const persistedCustomer = await customerRepository.save(customer);

            const res = await request.post("/orders").send({
                customerId: persistedCustomer.id,
                items: [{ productId: UUIDGenerator.generate(), quantity: 1 }],
            });

            expect(res.status).toBe(404);
        });

        it("should return 409 when stock is insufficient", async () => {
            const customer = await Customer.create({
                name: "John Doe",
                email: "john.doe@email.com",
            });
            const persistedCustomer = await customerRepository.save(customer);
            const product = await Product.create({
                name: "Keyboard",
                price: 10,
                stock: 1,
            });
            const persistedProduct = await productRepository.save(product);

            const res = await request.post("/orders").send({
                customerId: persistedCustomer.id,
                items: [{ productId: persistedProduct.id, quantity: 2 }],
            });

            expect(res.status).toBe(409);
        });
    });

    describe("getById", () => {
        it("should return 200 with order details", async () => {
            const customer = await Customer.create({
                name: "John Doe",
                email: "john.doe@email.com",
            });
            const persistedCustomer = await customerRepository.save(customer);
            const product = await Product.create({
                name: "Keyboard",
                price: 10,
                stock: 5,
            });
            const persistedProduct = await productRepository.save(product);
            const created = await request
                .post("/orders")
                .send({
                    customerId: persistedCustomer.id,
                    items: [{ productId: persistedProduct.id, quantity: 2 }],
                })
                .expect(201);

            const res = await request
                .get(`/orders/${created.body.id}`)
                .expect(200);

            expect(res.body).toMatchObject({
                id: created.body.id,
                customerId: persistedCustomer.id,
                total: 20,
            });
            expect(res.body.items).toHaveLength(1);
        });

        it("should return 404 when order not found", async () => {
            const res = await request
                .get(`/orders/${UUIDGenerator.generate()}`)
                .expect(404);

            expect(res.body).toHaveProperty("message");
        });

        it("should return 400 when id is invalid uuid", async () => {
            const res = await request.get("/orders/invalid");

            expect(res.status).toBe(400);
        });
    });
});
