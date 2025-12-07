import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CreateCustomerUseCase } from "@/domain/customers/use-cases";
import { CustomerInput, CustomerOutput } from "@/api/customers/models";
import { CustomerMapper } from "@/api/customers/mappers";

@injectable()
export class CustomerController {
    constructor(
        @inject(CreateCustomerUseCase)
        private readonly createCustomerUseCase: CreateCustomerUseCase,
    ) {}

    public create = async (
        req: Request<{}, {}, CustomerInput>,
        res: Response<CustomerOutput>,
    ) => {
        const { name, email } = req.body;
        const customer = await this.createCustomerUseCase.perform({
            name,
            email,
        });
        res.status(201).send(CustomerMapper.toOutput(customer));
    };
}
