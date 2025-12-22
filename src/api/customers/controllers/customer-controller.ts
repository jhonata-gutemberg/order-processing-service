import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
    CreateCustomerUseCase,
    GetCustomerByIdUseCase,
} from "@/domain/customers/use-cases";
import { CustomerOutput, PageOutput } from "@/api/customers/models";
import { CustomerMapper, PageMapper } from "@/api/customers/mappers";
import { CUSTOMER_REPOSITORY_TOKEN } from "@/infra/di/tokens";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { PageQueryParamsMapper } from "@/api/customers/mappers";
import { UUID } from "@/domain/shared/models/value-objects";
import {
    CustomerInputSchema,
    PageQueryParamsSchema,
} from "@/api/customers/schemas";

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

    public create = async (req: Request, res: Response<CustomerOutput>) => {
        const props = CustomerInputSchema.parse(req.body);
        const customer = await this.createCustomerUseCase.perform(props);
        res.status(201).send(CustomerMapper.toOutput(customer));
    };

    public search = async (
        req: Request,
        res: Response<PageOutput<CustomerOutput>>,
    ) => {
        const pageQueryParams = PageQueryParamsSchema.parse(req.query);
        const pageable =
            await PageQueryParamsMapper.toPageable(pageQueryParams);
        const page = await this.customerRepository.findAll(pageable);
        res.send(PageMapper.toOutput(page, CustomerMapper.toOutput));
    };

    public getById = async (req: Request, res: Response<CustomerOutput>) => {
        const id = UUID.from(req.params.id);
        const customer = await this.getCustomerByIdUseCase.perform(id);
        res.send(CustomerMapper.toOutput(customer));
    };
}
