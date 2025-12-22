import { beforeAll, describe, expect, it, Mocked, vi } from "vitest";
import { CreateOrderUseCase } from "@/domain/orders/use-cases";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { OrderRepository } from "@/domain/orders/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities";
import { Product } from "@/domain/products/models/entities";
import { CustomerNotFoundException } from "@/domain/customers/models/exceptions";
import { ProductNotFoundException } from "@/domain/products/models/exceptions";
import { InsufficientStockException } from "@/domain/orders/models/exceptions";
import { Order } from "@/domain/orders/models/entities";
import { UUIDGenerator } from "@/domain/shared/generators";

let createOrderUseCase: CreateOrderUseCase;
let customerRepository: Mocked<CustomerRepository>;
let productRepository: Mocked<ProductRepository>;
let orderRepository: Mocked<OrderRepository>;

beforeAll(() => {
    customerRepository = {
        findById: vi.fn(),
        findByEmail: vi.fn(),
        save: vi.fn(),
        findAll: vi.fn(),
    };
    productRepository = {
        findById: vi.fn(),
        save: vi.fn(),
        findAll: vi.fn(),
    };
    orderRepository = {
        save: vi.fn(),
        findById: vi.fn(),
    };
    createOrderUseCase = new CreateOrderUseCase(
        customerRepository,
        productRepository,
        orderRepository,
    );
});

describe("CreateOrderUseCase", () => {
    it("should create order, deduct stock, and calculate total", async () => {
        const customerId = UUIDGenerator.generate();
        const productId1 = UUIDGenerator.generate();
        const productId2 = UUIDGenerator.generate();
        const customer = await Customer.create({
            id: customerId,
            name: "John Doe",
            email: "john.doe@email.com",
        });
        const product1 = await Product.create({
            id: productId1,
            name: "Keyboard",
            price: 10,
            stock: 5,
        });
        const product2 = await Product.create({
            id: productId2,
            name: "Mouse",
            price: 5.5,
            stock: 10,
        });
        customerRepository.findById.mockResolvedValue(customer);
        productRepository.findById
            .mockResolvedValueOnce(product1)
            .mockResolvedValueOnce(product2);
        productRepository.save.mockImplementation(async (p) => p);
        orderRepository.save.mockImplementation(async (o) => o);

        const order = await createOrderUseCase.perform({
            customerId,
            items: [
                { productId: productId1, quantity: 2 },
                { productId: productId2, quantity: 3 },
            ],
        });

        expect(customerRepository.findById).toHaveBeenCalledExactlyOnceWith(
            customerId,
        );
        expect(productRepository.findById).toHaveBeenCalledTimes(2);
        expect(productRepository.save).toHaveBeenCalledTimes(2);
        expect(orderRepository.save).toHaveBeenCalledExactlyOnceWith(
            expect.any(Order),
        );
        const savedOrder = orderRepository.save.mock.calls[0][0];
        expect(savedOrder.customerId).toBe(customerId);
        expect(savedOrder.items).toHaveLength(2);
        expect(savedOrder.total).toBe(10 * 2 + 5.5 * 3);
        expect(product1.stock).toBe(3);
        expect(product2.stock).toBe(7);
        expect(order.total).toBe(10 * 2 + 5.5 * 3);
    });

    it("should throw when customer does not exist", async () => {
        const customerId = UUIDGenerator.generate();
        customerRepository.findById.mockResolvedValue(null);

        const useCase = () =>
            createOrderUseCase.perform({
                customerId,
                items: [{ productId: UUIDGenerator.generate(), quantity: 1 }],
            });

        await expect(useCase).rejects.throws(
            CustomerNotFoundException,
            `customer ${customerId} not found`,
        );
    });

    it("should throw when some product does not exist", async () => {
        const customerId = UUIDGenerator.generate();
        const productId = UUIDGenerator.generate();
        const customer = await Customer.create({
            id: customerId,
            name: "John Doe",
            email: "john.doe@email.com",
        });
        customerRepository.findById.mockResolvedValue(customer);
        productRepository.findById.mockResolvedValue(null);

        const useCase = () =>
            createOrderUseCase.perform({
                customerId,
                items: [{ productId, quantity: 1 }],
            });

        await expect(useCase).rejects.throws(
            ProductNotFoundException,
            `product ${productId} not found`,
        );
    });

    it("should throw when stock is insufficient", async () => {
        const customerId = UUIDGenerator.generate();
        const productId = UUIDGenerator.generate();
        const customer = await Customer.create({
            id: customerId,
            name: "John Doe",
            email: "john.doe@email.com",
        });
        const product = await Product.create({
            id: productId,
            name: "Keyboard",
            price: 10,
            stock: 1,
        });
        customerRepository.findById.mockResolvedValue(customer);
        productRepository.findById.mockResolvedValue(product);

        const useCase = () =>
            createOrderUseCase.perform({
                customerId,
                items: [{ productId, quantity: 2 }],
            });

        await expect(useCase).rejects.throws(
            InsufficientStockException,
            `insufficient stock for product ${productId}`,
        );
    });
});
