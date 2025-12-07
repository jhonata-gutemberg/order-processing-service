import { Router } from "express";
import { CreateCustomerUseCase } from "@/domain/customers/use-cases";
import { container } from "tsyringe";

const router = Router();
router.post("/customers", async (req, res) => {
    const createCustomerUseCase = container.resolve(CreateCustomerUseCase);
    const customer = await createCustomerUseCase.perform({
        name: req.body.name,
        email: req.body.email,
    });
    res.status(201).send({
        id: customer.id.toString(),
        name: customer.name,
        email: customer.email.toString(),
    });
});

export function customerRoutes() {
    return router;
}
