import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { container } from "tsyringe";
import { DataSource } from "typeorm";
import { createApp } from "@/infra/express";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";
import { CustomerPersistenceModel } from "@/infra/typeorm/customers/models";

describe("CustomerController", () => {
    let dataSource: DataSource;

    beforeAll(() => {
        dataSource = container.resolve(DATA_SOURCE_TOKEN);
    });

    it("should return 201 when customer created", async () => {
        const name = "John Doe";
        const email = "john.doe@email.com";

        const r = request(createApp());
        const res = await r
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
