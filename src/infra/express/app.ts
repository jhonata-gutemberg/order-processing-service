import express from "express";
import { customerRoutes } from "@/infra/express/routes";

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use(customerRoutes());
    return app;
}
