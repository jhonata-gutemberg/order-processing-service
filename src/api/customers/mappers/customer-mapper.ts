import { CustomerOutput } from "@/api/customers/models/customer";
import { Customer } from "@/domain/customers/models/entities";

export class CustomerMapper {
    public static toOutput(customer: Customer): CustomerOutput {
        return {
            id: customer.id.toString(),
            name: customer.name,
            email: customer.email.toString(),
        };
    }
}
