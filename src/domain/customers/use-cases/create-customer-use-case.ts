import { inject, injectable } from "tsyringe";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Email } from "@/domain/customers/models/value-objects";
import { CustomerAlreadyExistsException } from "@/domain/customers/models/exceptions";
import { Customer } from "@/domain/customers/models/entities";
import { CUSTOMER_REPOSITORY_TOKEN } from "@/infra/di/tokens";

export type CreateCustomerUseCaseProps = {
    name: string;
    email: string;
};

@injectable()
export class CreateCustomerUseCase {
    constructor(
        @inject(CUSTOMER_REPOSITORY_TOKEN)
        private readonly customerRepository: CustomerRepository,
    ) {}

    public async perform({
        name,
        email: stringEmail,
    }: CreateCustomerUseCaseProps) {
        const email = Email.from(stringEmail);
        const customer = await this.customerRepository.findByEmail(email);
        if (customer) {
            throw new CustomerAlreadyExistsException(
                `customer ${email} already exists`,
            );
        }
        return await this.customerRepository.save(
            new Customer({ name, email }),
        );
    }
}
