import { Email } from "@/domain/customers/models/value-objects";
import { Customer } from "@/domain/customers/models/entities";
import { Page, Pageable } from "@/domain/shared/models/value-objects";

export interface CustomerRepository {
    findByEmail(email: Email): Promise<Customer | null>;
    save(customer: Customer): Promise<Customer>;
    findAll(pageable: Pageable): Promise<Page<Customer>>;
}
