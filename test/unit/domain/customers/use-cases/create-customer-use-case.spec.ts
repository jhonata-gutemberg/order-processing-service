import { beforeAll, describe, expect, it, Mocked, vi } from "vitest";
import { CreateCustomerUseCase } from "@/domain/customers/use-cases";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities";
import { CustomerAlreadyExistsException } from "@/domain/customers/models/exceptions";
import { Name, UUID } from "@/domain/shared/models/value-objects";

let createCustomerUseCase: CreateCustomerUseCase;
let customerRepository: Mocked<CustomerRepository>;

beforeAll(() => {
    customerRepository = {
        findById: vi.fn(),
        findByEmail: vi.fn(),
        save: vi.fn(),
        findAll: vi.fn(),
    };
    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
});

describe("CreateCustomerUseCase", () => {
    it("should be able to create a customer", async () => {
        const name = Name.of("John Doe");
        const email = "john.doe@email.com";
        const props = { name, email };
        const persistedCustomer = await Customer.create(props);
        customerRepository.save.mockResolvedValue(persistedCustomer);

        const customer = await createCustomerUseCase.perform(props);

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
        const name = Name.of("John Doe");
        const email = "john.doe@email.com";
        const props = { name, email };
        const customer = await Customer.create(props);
        customerRepository.findByEmail.mockResolvedValue(customer);

        const useCase = () => createCustomerUseCase.perform(props);

        await expect(useCase).rejects.throws(
            CustomerAlreadyExistsException,
            `customer ${email} already exists`,
        );
    });
});
