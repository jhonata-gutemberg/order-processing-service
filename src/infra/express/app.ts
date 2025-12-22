import express from "express";
import { customerRoutes, orderRoutes, productRoutes } from "@/infra/express/routes";
import { errorHandler } from "@/infra/express/handlers";

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use(customerRoutes());
    app.use(productRoutes());
    app.use(orderRoutes());
    app.use(errorHandler);
    return app;
}
