import express from "express";
import { customerRoutes } from "@/infra/express/routes";

const app = express();
app.use(express.json());
app.use(customerRoutes());

export { app };
