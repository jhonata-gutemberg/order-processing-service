import { describe, expect, it } from "vitest";
import { Email, UUID } from "@/domain/customers/models/value-objects";
import { IllegalArgumentException } from "@/domain/customers/models/exceptions";
import { Customer } from "@/domain/customers/models/entities/customer";

describe("Customer", () => {
    it("should be able to create customer", () => {
        const id = UUID.random();
        const name = "John Doe";
        const email = Email.from("john.doe@email.com");

        const customer = new Customer({ id, name, email });

        expect(customer.id).toBe(id);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
    });

    it("should be able to create customer without passing id", () => {
        const name = "John Doe";
        const email = Email.from("john.doe@email.com");

        const customer = new Customer({ name, email });

        expect(customer.id).toBeInstanceOf(UUID);
        expect(customer.name).toBe(name);
        expect(customer.email).toBe(email);
    });

    it("should not be able to create customer without a empty name", () => {
        const name = "   ";
        const email = Email.from("john.doe@email.com");

        const customer = () => new Customer({ name, email });

        expect(customer).throws(
            IllegalArgumentException,
            "name must not be empty",
        );
    });

    it("should not be able to create customer without a special characters", () => {
        const name = "John@Doe";
        const email = Email.from("john.doe@email.com");

        const customer = () => new Customer({ name, email });

        expect(customer).throws(
            IllegalArgumentException,
            "name must not contain numbers or special characters",
        );
    });

    it("should not be able to create customer if name length is less than 2", () => {
        const name = "J";
        const email = Email.from("john.doe@email.com");

        const customer = () => new Customer({ name, email });

        expect(customer).throws(
            IllegalArgumentException,
            "name must be at least 2 characters",
        );
    });
});
