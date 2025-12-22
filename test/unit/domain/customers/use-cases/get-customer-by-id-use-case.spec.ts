import { beforeAll, describe, expect, it, Mocked, vi } from "vitest";
import { GetCustomerByIdUseCase } from "@/domain/customers/use-cases";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities";
import { CustomerNotFoundException } from "@/domain/customers/models/exceptions";
import { UUID } from "@/domain/shared/models/value-objects";

let getCustomerByIdUseCase: GetCustomerByIdUseCase;
let customerRepository: Mocked<CustomerRepository>;

beforeAll(() => {
    customerRepository = {
        findById: vi.fn(),
        findByEmail: vi.fn(),
        save: vi.fn(),
        findAll: vi.fn(),
    };
    getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository);
});

describe("GetCustomerByIdUseCase", () => {
    it("should return a customer when found", async () => {
        const id = UUID.random();
        const customer = await Customer.create({
            id,
            name: "John Doe",
            email: "john.doe@email.com",
        });
        customerRepository.findById.mockResolvedValue(customer);

        const result = await getCustomerByIdUseCase.perform(id);

        expect(customerRepository.findById).toHaveBeenCalledExactlyOnceWith(id);
        expect(result).toBe(customer);
    });

    it("should throw when customer is not found", async () => {
        const id = UUID.random();
        customerRepository.findById.mockResolvedValue(null);

        const useCase = () => getCustomerByIdUseCase.perform(id);

        await expect(useCase).rejects.throws(
            CustomerNotFoundException,
            `customer ${id.toString()} not found`,
        );
    });
});
