import { beforeAll, describe, expect, it } from "vitest";
import { container } from "tsyringe";
import { DataSource } from "typeorm";
import TestAgent from "supertest/lib/agent";
import {
    DATA_SOURCE_TOKEN,
    PRODUCT_REPOSITORY_TOKEN,
    TEST_AGENT_TOKEN,
} from "@/infra/di/tokens";
import { ProductPersistenceModel } from "@/infra/typeorm/products/models";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { Product } from "@/domain/products/models/entities";
import { UUIDGenerator } from "@/domain/shared/generators";

describe("ProductController", () => {
    let dataSource: DataSource;
    let request: TestAgent;
    let productRepository: ProductRepository;

    beforeAll(() => {
        dataSource = container.resolve(DATA_SOURCE_TOKEN);
        request = container.resolve(TEST_AGENT_TOKEN);
        productRepository = container.resolve(PRODUCT_REPOSITORY_TOKEN);
    });

    describe("create", () => {
        it("should return 201 when product created", async () => {
            const name = "Keyboard";
            const price = 10;
            const stock = 5;

            const res = await request
                .post("/products")
                .send({
                    name,
                    price,
                    stock,
                })
                .expect(201);

            expect(res.body).toHaveProperty("id");
            expect(res.body).toMatchObject({
                name,
                price,
                stock,
            });
            const persistenceModel = await dataSource.manager.findOneBy(
                ProductPersistenceModel,
                {
                    id: res.body.id,
                },
            );
            expect(persistenceModel).toBeInstanceOf(ProductPersistenceModel);
            expect(persistenceModel?.name).toBe(name);
            expect(persistenceModel?.price).toBe(price);
            expect(persistenceModel?.stock).toBe(stock);
        });

        it("should return 400 when name is not provided", async () => {
            const res = await request.post("/products").send({
                price: 10,
                stock: 5,
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 when price is negative", async () => {
            const res = await request.post("/products").send({
                name: "Keyboard",
                price: -1,
                stock: 5,
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 when stock is negative", async () => {
            const res = await request.post("/products").send({
                name: "Keyboard",
                price: 10,
                stock: -1,
            });

            expect(res.status).toBe(400);
        });
    });

    describe("updateStock", () => {
        it("should return 200 when stock updated", async () => {
            const product = await productRepository.save(
                await Product.create({
                    name: "Keyboard",
                    price: 10,
                    stock: 5,
                }),
            );

            const res = await request
                .patch(`/products/${product.id.toString()}/stock`)
                .send({
                    stock: 9,
                })
                .expect(200);

            expect(res.body).toMatchObject({
                id: product.id.toString(),
                name: "Keyboard",
                price: 10,
                stock: 9,
            });
        });

        it("should return 400 when stock is invalid", async () => {
            const id = UUIDGenerator.generate();

            const res = await request
                .patch(`/products/${id.toString()}/stock`)
                .send({
                    stock: -1,
                });

            expect(res.status).toBe(400);
        });

        it("should return 404 when product does not exist", async () => {
            const id = UUIDGenerator.generate();

            const res = await request
                .patch(`/products/${id.toString()}/stock`)
                .send({
                    stock: 1,
                })
                .expect(404);

            expect(res.body).toMatchObject({
                message: `product ${id.toString()} not found`,
            });
        });
    });

    describe("search", () => {
        it("should return 200 with a list of products", async () => {
            await productRepository.save(
                await Product.create({
                    name: "A",
                    price: 10,
                    stock: 1,
                }),
            );
            await productRepository.save(
                await Product.create({
                    name: "B",
                    price: 20,
                    stock: 2,
                }),
            );
            await productRepository.save(
                await Product.create({
                    name: "C",
                    price: 30,
                    stock: 3,
                }),
            );

            const res = await request.get(`/products?sortBy=name`).expect(200);

            expect(res.body).toMatchObject({
                content: [
                    {
                        name: "A",
                        price: 10,
                        stock: 1,
                    },
                    {
                        name: "B",
                        price: 20,
                        stock: 2,
                    },
                    {
                        name: "C",
                        price: 30,
                        stock: 3,
                    },
                ],
                currentPage: 0,
                pageSize: 10,
                totalItems: 3,
                totalPages: 1,
            });
        });
    });
});
