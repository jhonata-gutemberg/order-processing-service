import { beforeAll, describe, expect, it, Mocked, vi } from "vitest";
import { UpdateProductStockUseCase } from "@/domain/products/use-cases";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { Product } from "@/domain/products/models/entities";
import { ProductNotFoundException } from "@/domain/products/models/exceptions";
import { UUIDGenerator } from "@/domain/shared/generators";

let updateProductStockUseCase: UpdateProductStockUseCase;
let productRepository: Mocked<ProductRepository>;

beforeAll(() => {
    productRepository = {
        findById: vi.fn(),
        save: vi.fn(),
        findAll: vi.fn(),
    };
    updateProductStockUseCase = new UpdateProductStockUseCase(productRepository);
});

describe("UpdateProductStockUseCase", () => {
    it("should update product stock when found", async () => {
        const id = UUIDGenerator.generate();
        const product = await Product.create({
            id,
            name: "Keyboard",
            price: 10,
            stock: 5,
        });
        productRepository.findById.mockResolvedValue(product);
        productRepository.save.mockResolvedValue(product);

        const result = await updateProductStockUseCase.perform({
            id,
            stock: 9,
        });

        expect(productRepository.findById).toHaveBeenCalledExactlyOnceWith(id);
        expect(productRepository.save).toHaveBeenCalledExactlyOnceWith(product);
        expect(result.stock).toBe(9);
    });

    it("should throw when product is not found", async () => {
        const id = UUIDGenerator.generate();
        productRepository.findById.mockResolvedValue(null);

        const useCase = () =>
            updateProductStockUseCase.perform({
                id,
                stock: 2,
            });

        await expect(useCase).rejects.throws(
            ProductNotFoundException,
            `product ${id.toString()} not found`,
        );
    });
});
