import { beforeAll, describe, expect, it, Mocked, vi } from "vitest";
import { CreateProductUseCase } from "@/domain/products/use-cases";
import { ProductRepository } from "@/domain/products/contracts/repositories";
import { Product } from "@/domain/products/models/entities";

let createProductUseCase: CreateProductUseCase;
let productRepository: Mocked<ProductRepository>;

beforeAll(() => {
    productRepository = {
        findById: vi.fn(),
        save: vi.fn(),
        findAll: vi.fn(),
    };
    createProductUseCase = new CreateProductUseCase(productRepository);
});

describe("CreateProductUseCase", () => {
    it("should be able to create a product", async () => {
        const name = "Keyboard";
        const price = 10;
        const stock = 5;
        const props = { name, price, stock };
        const persistedProduct = await Product.create(props);
        productRepository.save.mockResolvedValue(persistedProduct);

        const product = await createProductUseCase.perform(props);

        expect(productRepository.save).toHaveBeenCalledExactlyOnceWith(
            expect.any(Product),
        );
        const productToPersist = productRepository.save.mock.calls[0][0];
        expect(productToPersist.name).toBe(name);
        expect(productToPersist.price).toBe(price);
        expect(productToPersist.stock).toBe(stock);
        expect(product).toBeInstanceOf(Product);
        expect(product.name).toBe(name);
        expect(product.price).toBe(price);
        expect(product.stock).toBe(stock);
    });
});
