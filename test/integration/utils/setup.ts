import "reflect-metadata";
import { afterAll, afterEach, beforeAll } from "vitest";
import { DataSource } from "typeorm";
import { container } from "tsyringe";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";
import { createTestDataSource } from "./create-test-data-source";
import { truncateTables } from "./truncate-tables";

let postgresContainer: StartedPostgreSqlContainer;
let dataSource: DataSource;

beforeAll(async () => {
    const setup = await createTestDataSource();
    postgresContainer = setup.postgresContainer;
    dataSource = setup.dataSource;
    container.registerInstance(DATA_SOURCE_TOKEN, dataSource);
}, 60000);

afterEach(async () => {
    await truncateTables(dataSource);
});

afterAll(async () => {
    await dataSource.destroy();
    await postgresContainer.stop();
});
