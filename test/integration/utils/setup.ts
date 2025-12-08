import "reflect-metadata";
import { afterAll, afterEach, beforeAll } from "vitest";
import { DataSource } from "typeorm";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { createTestDataSource } from "./create-test-data-source";
import { truncateTables } from "./truncate-tables";
import { register } from "./register";

let postgresContainer: StartedPostgreSqlContainer;
let dataSource: DataSource;

beforeAll(async () => {
    const setup = await createTestDataSource();
    postgresContainer = setup.postgresContainer;
    dataSource = setup.dataSource;
    register(dataSource);
}, 60000);

afterEach(async () => {
    await truncateTables(dataSource);
});

afterAll(async () => {
    await dataSource.destroy();
    await postgresContainer.stop();
});
