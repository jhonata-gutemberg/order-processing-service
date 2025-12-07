import { describe, it, expect, beforeAll } from "vitest";
import { v4 as uuidV4 } from "uuid";
import { container } from "tsyringe";
import { DataSource } from "typeorm";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities/customer";
import { Email } from "@/domain/customers/models/value-objects";
import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { TypeORMCustomerRepository } from "@/infra/typeorm/customers/repositories";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";

describe("TypeORMCustomerRepository", () => {
    let dataSource: DataSource;
    let customerRepository: CustomerRepository;

    beforeAll(async () => {
        dataSource = container.resolve(DATA_SOURCE_TOKEN);
        customerRepository = container.resolve(TypeORMCustomerRepository);
    });

    it("should be able to persist a customer", async () => {
        const name = "John Doe";
        const email = Email.from("john.doe@email.com");
        const customer = new Customer({ name, email });

        await customerRepository.save(customer);

        const customerPersistenceModel = await dataSource.manager.findOneBy(
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
        await dataSource.manager.save(customerPersistenceModel);

        const customer = await customerRepository.findByEmail(
            Email.from(email),
        );

        expect(customer).toBeInstanceOf(Customer);
        expect(customer?.id.toString()).toBe(customerPersistenceModel.id);
        expect(customer?.name).toBe(customerPersistenceModel.name);
        expect(customer?.email.toString()).toBe(customerPersistenceModel.email);
    });
});
