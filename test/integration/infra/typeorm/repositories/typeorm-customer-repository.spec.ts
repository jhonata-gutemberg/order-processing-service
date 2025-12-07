import { describe, it, expect, beforeAll } from "vitest";
import { v4 as uuidV4 } from "uuid";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities/customer";
import { Email } from "@/domain/customers/models/value-objects";
import { CustomerPersistenceModel } from "@/infra/typeorm";
import { TypeORMCustomerRepository } from "@/infra/typeorm/repositories";

describe("TypeORMCustomerRepository", () => {
    let customerRepository: CustomerRepository;

    beforeAll(async () => {
        customerRepository = new TypeORMCustomerRepository(testDataSource);
    });

    it("should be able to persist a customer", async () => {
        const name = "John Doe";
        const email = Email.from("john.doe@email.com");
        const customer = new Customer({ name, email });

        await customerRepository.save(customer);

        const customerPersistenceModel = await testDataSource.manager.findOneBy(
            CustomerPersistenceModel,
            { id: customer.id.toString() },
        );
        expect(customerPersistenceModel).toBeInstanceOf(
            CustomerPersistenceModel,
        );
        expect(customerPersistenceModel?.name).toBe(customer.name);
        expect(customerPersistenceModel?.email).toBe(customer.email.toString());
    });

    it("should be able to find customer by email", async () => {
        const email = "john.doe@email.com";
        const customerPersistenceModel = new CustomerPersistenceModel();
        customerPersistenceModel.id = uuidV4();
        customerPersistenceModel.name = "John Doe";
        customerPersistenceModel.email = email;
        await testDataSource.manager.save(customerPersistenceModel);

        const customer = await customerRepository.findByEmail(
            Email.from(email),
        );

        expect(customer).toBeInstanceOf(Customer);
        expect(customer?.id.toString()).toBe(customerPersistenceModel.id);
        expect(customer?.name).toBe(customerPersistenceModel.name);
        expect(customer?.email.toString()).toBe(customerPersistenceModel.email);
    });
});
