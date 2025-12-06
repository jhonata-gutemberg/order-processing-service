import { DataSource } from "typeorm";
import { CustomerPersistenceModel } from "@/infra/typeorm/models/entities";

export type AppDataSourceProps = {
    port: number;
    username: string;
    password: string;
    database: string;
};

export class AppDataSource {
    private dataSource: DataSource;

    constructor(props?: AppDataSourceProps) {
        this.dataSource = new DataSource({
            type: "postgres",
            host: "localhost",
            port: props?.port || 5432,
            username: props?.username || "test",
            password: props?.password || "test",
            database: props?.database || "test",
            synchronize: true,
            logging: true,
            entities: [CustomerPersistenceModel],
            subscribers: [],
            migrations: [],
        });
    }

    public initialize(): Promise<DataSource> {
        return this.dataSource.initialize();
    }
}
