import { describe, expect, it } from "vitest";
import { UUID } from "@/domain/customers/models/value-objects";
import { Customer } from "@/domain/customers/models/entities";
import { Name, Email } from "@/domain/shared/models/value-objects";

describe("Customer", () => {
    it("should be able to create customer", () => {
        const id = UUID.random();
        const name = Name.of("John Doe");
        const email = Email.of("john.doe@email.com");

        const customer = Customer.create({ id, name, email });

        expect(customer.id).toBe(id);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
    });

    it("should be able to create customer without passing id", () => {
        const name = Name.of("John Doe");
        const email = Email.of("john.doe@email.com");

        const customer = Customer.create({ name, email });

        expect(customer.id).toBeInstanceOf(UUID);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
    });
});
