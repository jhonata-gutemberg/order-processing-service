import { inject, injectable } from "tsyringe";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { CustomerNotFoundException } from "@/domain/customers/models/exceptions";
import { CUSTOMER_REPOSITORY_TOKEN } from "@/infra/di/tokens";
import { UUID } from "@/domain/shared/models/value-objects";

@injectable()
export class GetCustomerByIdUseCase {
    constructor(
        @inject(CUSTOMER_REPOSITORY_TOKEN)
        private readonly customerRepository: CustomerRepository,
    ) {}

    public async perform(id: UUID) {
        const customer = await this.customerRepository.findById(id);
        if (customer == null) {
            throw new CustomerNotFoundException(
                `customer ${id.toString()} not found`,
            );
        }
        return customer;
    }
}
