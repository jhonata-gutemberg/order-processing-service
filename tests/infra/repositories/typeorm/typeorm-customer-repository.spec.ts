import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities/customer";
import { Email } from "@/domain/customers/models/value-objects";
import { AppDataSource } from "@/infra/typeorm/data-source";
import { CustomerPersistenceModel } from "@/infra/typeorm/models/entities";
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { TypeORMCustomerRepository } from "@/infra/typeorm/repositories";

describe("TypeORMCustomerRepository", () => {
    let postgresContainer: StartedPostgreSqlContainer;
    let dataSource: DataSource;
    let customerRepository: CustomerRepository;

    beforeAll(async () => {
        postgresContainer = await new PostgreSqlContainer(
            "postgres:18.1",
        ).start();
        const appDataSource = new AppDataSource({
            port: postgresContainer.getPort(),
            username: postgresContainer.getUsername(),
            password: postgresContainer.getPassword(),
            database: postgresContainer.getDatabase(),
        });
        dataSource = await appDataSource.initialize();
        customerRepository = new TypeORMCustomerRepository(dataSource);
    }, 60000);

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
});
