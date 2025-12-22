import { beforeAll, describe, expect, it, Mocked, vi } from "vitest";
import { GetOrderByIdUseCase } from "@/domain/orders/use-cases";
import { OrderRepository } from "@/domain/orders/contracts/repositories";
import { OrderNotFoundException } from "@/domain/orders/models/exceptions";
import { Order } from "@/domain/orders/models/entities";
import { UUIDGenerator } from "@/domain/shared/generators";

let getOrderByIdUseCase: GetOrderByIdUseCase;
let orderRepository: Mocked<OrderRepository>;

beforeAll(() => {
    orderRepository = {
        save: vi.fn(),
        findById: vi.fn(),
    };
    getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
});

describe("GetOrderByIdUseCase", () => {
    it("should return order when found", async () => {
        const id = UUIDGenerator.generate();
        const order = await Order.create({
            id,
            customerId: UUIDGenerator.generate(),
            items: [{ productId: UUIDGenerator.generate(), quantity: 1, unitPrice: 10 }],
        });

        orderRepository.findById.mockResolvedValue(order);

        const result = await getOrderByIdUseCase.perform(id);

        expect(orderRepository.findById).toHaveBeenCalledExactlyOnceWith(id);
        expect(result.id).toBe(id);
    });

    it("should throw when order is not found", async () => {
        const id = UUIDGenerator.generate();
        orderRepository.findById.mockResolvedValue(null);

        const useCase = () => getOrderByIdUseCase.perform(id);

        await expect(useCase).rejects.throws(
            OrderNotFoundException,
            `order ${id} not found`,
        );
    });
});
