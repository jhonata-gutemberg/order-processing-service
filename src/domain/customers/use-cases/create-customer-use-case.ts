import { CustomerRepository } from "@domain/customers/contracts/repositories";
import { Email } from "@domain/customers/models/value-objects";
import { CustomerAlreadyExistsException } from "@domain/customers/models/exceptions";
import { Customer } from "@domain/customers/models/entities/customer";

export type CreateCustomerUseCaseProps = {
    name: string;
    email: string;
};

export class CreateCustomerUseCase {
    constructor(private readonly customerRepository: CustomerRepository) {}

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
