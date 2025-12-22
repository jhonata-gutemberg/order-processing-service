import { beforeAll, describe, expect, it } from "vitest";
import { container } from "tsyringe";
import { DataSource } from "typeorm";
import TestAgent from "supertest/lib/agent";
import {
    CUSTOMER_REPOSITORY_TOKEN,
    DATA_SOURCE_TOKEN,
    TEST_AGENT_TOKEN,
} from "@/infra/di/tokens";
import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Customer } from "@/domain/customers/models/entities";
import { UUIDGenerator } from "@/domain/shared/generators";

describe("CustomerController", () => {
    let dataSource: DataSource;
    let request: TestAgent;
    let customerRepository: CustomerRepository;

    beforeAll(() => {
        dataSource = container.resolve(DATA_SOURCE_TOKEN);
        request = container.resolve(TEST_AGENT_TOKEN);
        customerRepository = container.resolve(CUSTOMER_REPOSITORY_TOKEN);
    });

    describe("create", () => {
        it("should return 201 when customer created", async () => {
            const name = "John Doe";
            const email = "john.doe@email.com";

            const res = await request
                .post("/customers")
                .send({
                    name,
                    email,
                })
                .expect(201);

            expect(res.body).toHaveProperty("id");
            expect(res.body).toMatchObject({
                name,
                email,
            });
            const persistenceModel = await dataSource.manager.findOneBy(
                CustomerPersistenceModel,
                {
                    id: res.body.id,
                },
            );
            expect(persistenceModel).toBeInstanceOf(CustomerPersistenceModel);
            expect(persistenceModel?.name).toBe(name);
            expect(persistenceModel?.email).toBe(email);
        });

        it("should return 400 when email is not provided", async () => {
            const name = "John Doe";

            const res = await request.post("/customers").send({
                name,
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 when email is empty", async () => {
            const name = "John Doe";
            const email = "   ";

            const res = await request.post("/customers").send({
                name,
                email,
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 when email is invalid", async () => {
            const name = "John Doe";
            const email = "invalid email";

            const res = await request.post("/customers").send({
                name,
                email,
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 when name is not provided", async () => {
            const email = "john.doe@email.com";

            const res = await request.post("/customers").send({
                email,
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 when name is empty", async () => {
            const name = "   ";
            const email = "john.doe@email.com";

            const res = await request
                .post("/customers")
                .send({
                    name,
                    email,
                })
                .expect(400);

            expect(res.status).toBe(400);
        });

        it("should return 400 when name has only one character", async () => {
            const name = "t";
            const email = "john.doe@email.com";

            const res = await request.post("/customers").send({
                name,
                email,
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 when name has especial characters", async () => {
            const name = "John@Doe";
            const email = "john.doe@email.com";

            const res = await request.post("/customers").send({
                name,
                email,
            });

            expect(res.status).toBe(400);
        });

        it("should return 400 when name has especial numbers", async () => {
            const name = "John Doe123";
            const email = "john.doe@email.com";

            const res = await request.post("/customers").send({
                name,
                email,
            });

            expect(res.status).toBe(400);
        });

        it("should return 409 when customer already exists", async () => {
            const name = "John Doe";
            const email = "john.doe@email.com";
            const customer = await Customer.create({
                name,
                email,
            });
            await customerRepository.save(customer);

            const res = await request
                .post("/customers")
                .send({
                    name,
                    email: email.toString(),
                })
                .expect(409);

            expect(res.body).toMatchObject({
                message: `customer ${email.toString()} already exists`,
            });
        });
    });

    describe("search", () => {
        it("should return 200 with a list of customers", async () => {
            await customerRepository.save(
                await Customer.create({
                    name: "John Doe",
                    email: "john.doe@email.com",
                }),
            );
            await customerRepository.save(
                await Customer.create({
                    name: "Anabel",
                    email: "anabel@email.com",
                }),
            );
            await customerRepository.save(
                await Customer.create({
                    name: "Newton",
                    email: "newton@email.com",
                }),
            );

            const res = await request.get(`/customers?sortBy=name`).expect(200);

            expect(res.body).toMatchObject({
                content: [
                    {
                        name: "Anabel",
                        email: "anabel@email.com",
                    },
                    {
                        name: "John Doe",
                        email: "john.doe@email.com",
                    },
                    {
                        name: "Newton",
                        email: "newton@email.com",
                    },
                ],
                currentPage: 0,
                pageSize: 10,
                totalItems: 3,
                totalPages: 1,
            });
        });
    });

    describe("getById", () => {
        it("should return 200 when customer exists", async () => {
            const email = "john.doe@email.com";
            const customer = await customerRepository.save(
                await Customer.create({
                    name: "John Doe",
                    email,
                }),
            );

            const res = await request
                .get(`/customers/${customer.id.toString()}`)
                .expect(200);

            expect(res.body).toMatchObject({
                id: customer.id.toString(),
                name: "John Doe",
                email,
            });
        });

        it("should return 404 when customer does not exist", async () => {
            const id = UUIDGenerator.generate();

            const res = await request
                .get(`/customers/${id.toString()}`)
                .expect(404);

            expect(res.body).toMatchObject({
                message: `customer ${id.toString()} not found`,
            });
        });
    });
});
