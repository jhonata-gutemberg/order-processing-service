import { describe, expect, it } from "vitest";
import { validate } from "uuid";
import { Product } from "@/domain/products/models/entities";
import { UUIDGenerator } from "@/domain/shared/generators";

describe("Product", () => {
    it("should be able to create product", async () => {
        const id = UUIDGenerator.generate();
        const name = "Keyboard";
        const price = 10;
        const stock = 5;

        const product = await Product.create({ id, name, price, stock });

        expect(product.id).toBe(id);
        expect(product.name).toBe(name);
        expect(product.price).toBe(price);
        expect(product.stock).toBe(stock);
    });

    it("should be able to create product without passing id", async () => {
        const name = "Keyboard";
        const price = 10;
        const stock = 5;

        const product = await Product.create({ name, price, stock });

        expect(validate(product.id)).toBeTruthy();
        expect(product.name).toBe(name);
        expect(product.price).toBe(price);
        expect(product.stock).toBe(stock);
    });

    it("should not be able to create product with a invalid uuid", async () => {
        const invalidUUID = "1234567890";
        const name = "Keyboard";
        const price = 10;
        const stock = 5;

        const uuid = () => Product.create({ id: invalidUUID, name, price, stock });

        await expect(uuid).rejects.toThrow();
    });
});
