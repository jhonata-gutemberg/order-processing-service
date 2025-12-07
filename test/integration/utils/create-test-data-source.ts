import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { createAppDataSource } from "@/infra/typeorm/data-source";

export async function createTestDataSource() {
    const postgresContainer = await new PostgreSqlContainer(
        "postgres:18.1",
    ).start();
    const appDataSource = await createAppDataSource({
        port: postgresContainer.getPort(),
        username: postgresContainer.getUsername(),
        password: postgresContainer.getPassword(),
        database: postgresContainer.getDatabase(),
    });
    const dataSource = await appDataSource.initialize();
    await dataSource.runMigrations();
    return {
        postgresContainer,
        dataSource,
    };
}
