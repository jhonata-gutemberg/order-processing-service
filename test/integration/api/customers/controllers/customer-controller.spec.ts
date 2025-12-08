import { beforeAll, describe, expect, it } from "vitest";
import { container } from "tsyringe";
import { DataSource } from "typeorm";
import TestAgent from "supertest/lib/agent";
import { DATA_SOURCE_TOKEN, TEST_AGENT_TOKEN } from "@/infra/di/tokens";
import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";

describe("CustomerController", () => {
    let dataSource: DataSource;
    let request: TestAgent;

    beforeAll(() => {
        dataSource = container.resolve(DATA_SOURCE_TOKEN);
        request = container.resolve(TEST_AGENT_TOKEN);
    });

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
});
