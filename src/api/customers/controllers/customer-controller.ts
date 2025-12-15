import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { z } from "zod";
import { CreateCustomerUseCase } from "@/domain/customers/use-cases";
import {
    CustomerOutput,
    PageableQueryParams,
    PageOutput,
} from "@/api/customers/models";
import { CustomerMapper, PageMapper } from "@/api/customers/mappers";
import { CUSTOMER_REPOSITORY_TOKEN } from "@/infra/di/tokens";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Name } from "@/domain/shared/models/value-objects";
import { Email } from "@/domain/customers/models/value-objects";

@injectable()
export class CustomerController {
    constructor(
        @inject(CreateCustomerUseCase)
        private readonly createCustomerUseCase: CreateCustomerUseCase,
        @inject(CUSTOMER_REPOSITORY_TOKEN)
        private readonly customerRepository: CustomerRepository,
    ) {}

    public create = async (req: Request, res: Response<CustomerOutput>) => {
        const schema = z.object({
            name: z.transform(Name.of),
            email: z.transform(Email.from),
        });
        const props = schema.parse(req.body);
        const customer = await this.createCustomerUseCase.perform(props);
        res.status(201).send(CustomerMapper.toOutput(customer));
    };

    public search = async (
        req: Request,
        res: Response<PageOutput<CustomerOutput>>,
    ) => {
        const pageableQueryParams = PageableQueryParams.parse(req.query);
        const page = await this.customerRepository.findAll(
            pageableQueryParams.toPageable(),
        );
        res.send(PageMapper.toOutput(page, CustomerMapper.toOutput));
    };
}
