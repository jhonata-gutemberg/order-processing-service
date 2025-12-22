import { describe, expect, it } from "vitest";
import { validate } from "uuid";
import { Customer } from "@/domain/customers/models/entities";
import { UUIDGenerator } from "@/domain/shared/generators";

describe("Customer", () => {
    it("should be able to create customer", async () => {
        const id = UUIDGenerator.generate();
        const name = "John Doe";
        const email = "john.doe@email.com";

        const customer = await Customer.create({ id, name, email });

        expect(customer.id).toBe(id);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
    });

    it("should be able to create customer without passing id", async () => {
        const name = "John Doe";
        const email = "john.doe@email.com";

        const customer = await Customer.create({ name, email });

        expect(validate(customer.id)).toBeTruthy();
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
    });

    it("should not be able to create a customer with a invalid uuid", async () => {
        const invalidUUID = "1234567890";
        const name = "John Doe";
        const email = "john.doe@email.com";

        const uuid = () => Customer.create({ id: invalidUUID, name, email });

        await expect(uuid).rejects.toThrow();
    });
});
