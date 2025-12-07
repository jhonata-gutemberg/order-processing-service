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
    const port = process.env.DATABASE_PORT
        ? Number.parseInt(process.env.DATABASE_PORT)
        : undefined;
    return new DataSource({
        type: "postgres",
        host: process.env.DATABASE_HOST ?? "localhost",
        port: props?.port ?? port ?? 5432,
        username: props?.username ?? process.env.DATABASE_USERNAME,
        password: props?.password ?? process.env.DATABASE_PASSWORD,
        database: props?.database || process.env.DATABASE_NAME,
        synchronize: false,
        logging: false,
        entities: await loadClasses("customers/models"),
        subscribers: [],
        migrations: await loadClasses("migrations"),
    });
}

export const AppDataSource = createAppDataSource();
