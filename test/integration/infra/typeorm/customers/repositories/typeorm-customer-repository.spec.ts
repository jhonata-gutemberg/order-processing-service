import { describe, it, expect, beforeAll } from "vitest";
import { v4 as uuidV4 } from "uuid";
import { container } from "tsyringe";
import { DataSource } from "typeorm";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities";
import { Email } from "@/domain/customers/models/value-objects";
import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { TypeORMCustomerRepository } from "@/infra/typeorm/customers/repositories";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";
import { Integer, Pageable, Sort } from "@/domain/shared/models/value-objects";

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
        const customerPersistenceModel = await persistCustomer(
            "John Doe",
            email,
        );

        const customer = await customerRepository.findByEmail(
            Email.from(email),
        );

        expect(customer).toBeInstanceOf(Customer);
        expect(customer?.id.toString()).toBe(customerPersistenceModel.id);
        expect(customer?.name).toBe(customerPersistenceModel.name);
        expect(customer?.email.toString()).toBe(customerPersistenceModel.email);
    });

    it("should be able to find all customers", async () => {
        await persistCustomer("Carlos", "carlos@email.com");
        await persistCustomer("Bruno", "bruno@email.com");
        await persistCustomer("Anabel", "anabel@email.com");

        const firstPage = await customerRepository.findAll(
            Pageable.of(Integer.ZERO, Integer.TWO, Sort.of("name")),
        );
        const secondPage = await customerRepository.findAll(
            Pageable.of(Integer.ONE, Integer.TWO, Sort.of("name")),
        );

        expect(firstPage.content.length).toBe(2);
        expect(firstPage.content[0].name).toBe("Anabel");
        expect(firstPage.content[0].email.toString()).toBe("anabel@email.com");
        expect(firstPage.content[1].name).toBe("Bruno");
        expect(firstPage.content[1].email.toString()).toBe("bruno@email.com");
        expect(firstPage.currentPage).toStrictEqual(Integer.ZERO);
        expect(firstPage.totalItems).toStrictEqual(Integer.TWO);
        expect(firstPage.totalPages).toStrictEqual(Integer.TWO);
        expect(secondPage.content.length).toBe(1);
        expect(secondPage.content[0].name).toBe("Carlos");
        expect(secondPage.content[0].email.toString()).toBe("carlos@email.com");
        expect(secondPage.currentPage).toStrictEqual(Integer.ONE);
        expect(secondPage.totalItems).toStrictEqual(Integer.ONE);
        expect(secondPage.totalPages).toStrictEqual(Integer.TWO);
    });

    it("should ignore invalid sortBy", async () => {
        await persistCustomer("Anabel", "anabel@email.com");
        await persistCustomer("Bruno", "bruno@email.com");
        await persistCustomer("Carlos", "carlos@email.com");

        const findAll = () =>
            customerRepository.findAll(
                Pageable.of(Integer.ZERO, Integer.TEN, Sort.of("invalid")),
            );

        expect(findAll).not.throws();
    });

    async function persistCustomer(name: string, email: string) {
        const customerPersistenceModel = new CustomerPersistenceModel();
        customerPersistenceModel.id = uuidV4();
        customerPersistenceModel.name = name;
        customerPersistenceModel.email = email;
        return await dataSource.manager.save(customerPersistenceModel);
    }
});
