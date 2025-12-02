import { Email } from "@domain/customers/models/value-objects";
import { Customer } from "@domain/customers/models/entities/customer";

export interface CustomerRepository {
    findByEmail(email: Email): Promise<Customer | null>;
    save(customer: Customer): Promise<Customer>;
}
