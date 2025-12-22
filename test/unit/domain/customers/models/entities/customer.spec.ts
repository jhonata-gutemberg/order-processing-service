import { describe, expect, it } from "vitest";
import { Customer } from "@/domain/customers/models/entities";
import { Name, Email, UUID } from "@/domain/shared/models/value-objects";

describe("Customer", () => {
    it("should be able to create customer", async () => {
        const id = UUID.random();
        const name = Name.of("John Doe");
        const email = await Email.of("john.doe@email.com");

        const customer = Customer.create({ id, name, email });

        expect(customer.id).toBe(id);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
    });

    it("should be able to create customer without passing id", async () => {
        const name = Name.of("John Doe");
        const email = await Email.of("john.doe@email.com");

        const customer = Customer.create({ name, email });

        expect(customer.id).toBeInstanceOf(UUID);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
    });
});
