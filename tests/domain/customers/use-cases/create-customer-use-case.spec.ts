import { beforeAll, describe, expect, it, Mocked, vi } from "vitest";
import { CreateCustomerUseCase } from "@domain/customers/use-cases";
import { CustomerRepository } from "@domain/customers/contracts/repositories";
import { Email, UUID } from "@domain/customers/models/value-objects";
import { Customer } from "@domain/customers/models/entities/customer";
import { CustomerAlreadyExistsException } from "@domain/customers/models/exceptions";

let createCustomerUseCase: CreateCustomerUseCase;
let customerRepository: Mocked<CustomerRepository>;

beforeAll(() => {
    customerRepository = {
        findByEmail: vi.fn(),
        save: vi.fn(),
    };
    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
});

describe("CreateCustomerUseCase", () => {
    it("should be able to create a customer", async () => {
        const name = "John Doe";
        const stringEmail = "john.doe@email.com";
        const email = Email.from(stringEmail);
        customerRepository.save.mockResolvedValue(
            new Customer({ name, email }),
        );

        const customer = await createCustomerUseCase.perform({
            name,
            email: stringEmail,
        });

        expect(customerRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(
            email,
        );
        expect(customerRepository.save).toHaveBeenCalledExactlyOnceWith(
            expect.any(Customer),
        );
        const customerToPersist = customerRepository.save.mock.calls[0][0];
        expect(customerToPersist.name).toBe(name);
        expect(customerToPersist.email).toStrictEqual(email);
        expect(customer).toBeInstanceOf(Customer);
        expect(customer.id).toBeInstanceOf(UUID);
        expect(customer.name).toBe(name);
        expect(customer.email).toStrictEqual(email);
    });

    it("should throw when customer already exists", async () => {
        const name = "John Doe";
        const email = "john.doe@email.com";
        customerRepository.findByEmail.mockResolvedValue(
            new Customer({ name, email: Email.from(email) }),
        );

        const useCase = () => createCustomerUseCase.perform({ name, email });

        await expect(useCase).rejects.throws(
            CustomerAlreadyExistsException,
            `customer ${email} already exists`,
        );
    });
});
