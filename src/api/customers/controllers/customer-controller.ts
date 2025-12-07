import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CreateCustomerUseCase } from "@/domain/customers/use-cases";

@injectable()
export class CustomerController {
    constructor(
        @inject(CreateCustomerUseCase)
        private readonly createCustomerUseCase: CreateCustomerUseCase,
    ) {}

    public create = async (req: Request, res: Response) => {
        const customer = await this.createCustomerUseCase.perform({
            name: req.body.name,
            email: req.body.email,
        });
        res.status(201).send({
            id: customer.id.toString(),
            name: customer.name,
            email: customer.email.toString(),
        });
    };
}
