import { Router } from "express";
import { container } from "tsyringe";
import { CustomerController } from "@/api/customers/controllers/customer-controller";

export function customerRoutes() {
    const router = Router();
    const customerController = container.resolve(CustomerController);
    router.post("/customers", customerController.create);
    return router;
}
