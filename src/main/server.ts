import "reflect-metadata";
import "dotenv/config";
import "@/infra/di/register";
import { container } from "tsyringe";
import { createApp } from "@/infra/express/app";
import { createAppDataSource } from "@/infra/typeorm/data-source";
import { DATA_SOURCE_TOKEN } from "@/infra/di/tokens";

async function bootstrap() {
    const dataSource = await createAppDataSource();
    await dataSource.initialize();
    container.registerInstance(DATA_SOURCE_TOKEN, dataSource);
    const app = createApp();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}

bootstrap().catch((err: Error) => {
    console.error("Failed to start application", err);
    process.exit(1);
});
