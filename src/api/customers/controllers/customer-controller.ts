import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CreateCustomerUseCase } from "@/domain/customers/use-cases";
import { CustomerInput, CustomerOutput } from "@/api/customers/models";
import { CustomerMapper } from "@/api/customers/mappers";
import {
    CustomerAlreadyExistsException,
    IllegalArgumentException,
} from "@/domain/customers/models/exceptions";
import { ErrorResponse } from "@/api/shared/models";

@injectable()
export class CustomerController {
    constructor(
        @inject(CreateCustomerUseCase)
        private readonly createCustomerUseCase: CreateCustomerUseCase,
    ) {}

    public create = async (
        req: Request<{}, {}, CustomerInput>,
        res: Response<CustomerOutput | ErrorResponse>,
    ) => {
        const { name, email } = req.body;
        try {
            const customer = await this.createCustomerUseCase.perform({
                name,
                email,
            });
            res.status(201).send(CustomerMapper.toOutput(customer));
        } catch (ex) {
            if (ex instanceof IllegalArgumentException) {
                res.status(400).send({
                    message: ex.message,
                });
            }
            if (ex instanceof CustomerAlreadyExistsException) {
                res.status(409).send({
                    message: ex.message,
                });
            }
            console.error(ex);
            res.status(500).send({
                message: "internal server error",
            });
        }
    };
}
