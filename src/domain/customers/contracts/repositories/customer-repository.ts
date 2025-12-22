import { Customer } from "@/domain/customers/models/entities";
import { Page, Pageable } from "@/domain/shared/models/value-objects";

export interface CustomerRepository {
    findById(id: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    save(customer: Customer): Promise<Customer>;
    findAll(pageable: Pageable): Promise<Page<Customer>>;
}
