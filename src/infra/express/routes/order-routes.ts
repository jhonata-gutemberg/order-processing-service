import { Router } from "express";
import { container } from "tsyringe";
import { OrderController } from "@/api/orders/controllers";

export function orderRoutes() {
    const router = Router();
    const orderController = container.resolve(OrderController);
    router.post("/orders", orderController.create);
    router.get("/orders/:id", orderController.getById);
    return router;
}
