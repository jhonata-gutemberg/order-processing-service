import { inject, injectable } from "tsyringe";
import { CustomerRepository } from "@/domain/customers/contracts/repositories";
import { Email } from "@/domain/customers/models/value-objects";
import { CustomerAlreadyExistsException } from "@/domain/customers/models/exceptions";
import { Customer } from "@/domain/customers/models/entities/customer";
import { TypeORMCustomerRepository } from "@/infra/typeorm/customers/repositories";

export type CreateCustomerUseCaseProps = {
    name: string;
    email: string;
};

@injectable()
export class CreateCustomerUseCase {
    constructor(
        @inject(TypeORMCustomerRepository)
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
