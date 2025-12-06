import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { AppDataSource } from "@/infra/typeorm/data-source";

export async function createTestDataSource() {
    const postgresContainer = await new PostgreSqlContainer(
        "postgres:18.1",
    ).start();
    const appDataSource = new AppDataSource({
        port: postgresContainer.getPort(),
        username: postgresContainer.getUsername(),
        password: postgresContainer.getPassword(),
        database: postgresContainer.getDatabase(),
    });
    const dataSource = await appDataSource.initialize();
    return {
        postgresContainer,
        dataSource,
    };
}
