import "reflect-metadata";
import { afterAll, afterEach, beforeAll } from "vitest";
import { DataSource } from "typeorm";
import { container } from "tsyringe";
import request from "supertest";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { DATA_SOURCE_TOKEN, TEST_AGENT_TOKEN } from "@/infra/di/tokens";
import { createApp } from "@/infra/express";
import { createTestDataSource } from "./create-test-data-source";
import { truncateTables } from "./truncate-tables";

let postgresContainer: StartedPostgreSqlContainer;
let dataSource: DataSource;

beforeAll(async () => {
    const setup = await createTestDataSource();
    postgresContainer = setup.postgresContainer;
    dataSource = setup.dataSource;
    container.registerInstance(DATA_SOURCE_TOKEN, dataSource);
    container.registerInstance(TEST_AGENT_TOKEN, request(createApp()));
}, 60000);

afterEach(async () => {
    await truncateTables(dataSource);
});

afterAll(async () => {
    await dataSource.destroy();
    await postgresContainer.stop();
});
