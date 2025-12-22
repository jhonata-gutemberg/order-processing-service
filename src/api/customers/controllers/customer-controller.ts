import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { z } from "zod";
import {
    CreateCustomerUseCase,
    GetCustomerByIdUseCase,
} from "@/domain/customers/use-cases";
import { CustomerOutput } from "@/api/customers/models";
import { CUSTOMER_REPOSITORY_TOKEN } from "@/infra/di/tokens";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { PageQueryParamsMapper } from "@/api/customers/mappers";
import { Page } from "@/domain/shared/models/value-objects";
import {
    CustomerInputSchema,
    PageQueryParamsSchema,
} from "@/api/customers/schemas";
import { Customer } from "@/domain/customers/models/entities";

@injectable()
export class CustomerController {
    constructor(
        @inject(CreateCustomerUseCase)
        private readonly createCustomerUseCase: CreateCustomerUseCase,
        @inject(GetCustomerByIdUseCase)
        private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
        @inject(CUSTOMER_REPOSITORY_TOKEN)
        private readonly customerRepository: CustomerRepository,
    ) {}

    public create = async (req: Request, res: Response<Customer>) => {
        const props = await CustomerInputSchema.parseAsync(req.body);
        const customer = await this.createCustomerUseCase.perform(props);
        res.status(201).send(customer);
    };

    public search = async (req: Request, res: Response<Page<Customer>>) => {
        const pageQueryParams = PageQueryParamsSchema.parse(req.query);
        const pageable =
            await PageQueryParamsMapper.toPageable(pageQueryParams);
        const page = await this.customerRepository.findAll(pageable);
        res.send(page);
    };

    public getById = async (req: Request, res: Response<CustomerOutput>) => {
        const id = z.uuidv4().parse(req.params.id);
        const customer = await this.getCustomerByIdUseCase.perform(id);
        res.send(customer);
    };
}
