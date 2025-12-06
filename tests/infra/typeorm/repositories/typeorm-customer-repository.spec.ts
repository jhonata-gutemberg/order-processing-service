import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { DataSource } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities/customer";
import { Email } from "@/domain/customers/models/value-objects";
import { CustomerPersistenceModel } from "@/infra/typeorm/models/entities";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { TypeORMCustomerRepository } from "@/infra/typeorm/repositories";
import { truncateTables } from "../../../utils/truncate-tables";
import { createTestDataSource } from "../../../utils/create-test-data-source";

describe("TypeORMCustomerRepository", () => {
    let postgresContainer: StartedPostgreSqlContainer;
    let dataSource: DataSource;
    let customerRepository: CustomerRepository;

    beforeAll(async () => {
        const setup = await createTestDataSource();
        postgresContainer = setup.postgresContainer;
        dataSource = setup.dataSource;
        customerRepository = new TypeORMCustomerRepository(dataSource);
    }, 60000);

    afterEach(async () => {
        await truncateTables(dataSource);
    });

    afterAll(async () => {
        await dataSource.destroy();
        await postgresContainer.stop();
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
