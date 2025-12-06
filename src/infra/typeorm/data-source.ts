import { DataSource } from "typeorm";
import { readdirSync } from "fs";
import { join } from "path";

export type AppDataSourceProps = {
    port: number;
    username: string;
    password: string;
    database: string;
};

async function loadClasses(folder: string) {
    const dir = join(__dirname, folder);
    const entities = await Promise.all(
        readdirSync(dir).map((file) => import(join(dir, file))),
    );
    return entities.map((entity) => Object.values(entity)[0] as string);
}

export async function createAppDataSource(props?: AppDataSourceProps) {
    return new DataSource({
        type: "postgres",
        host: "localhost",
        port: props?.port || 5432,
        username: props?.username || "test",
        password: props?.password || "test",
        database: props?.database || "test",
        synchronize: false,
        logging: false,
        entities: await loadClasses("models"),
        subscribers: [],
        migrations: await loadClasses("migrations"),
    });
}

export const AppDataSource = createAppDataSource();
