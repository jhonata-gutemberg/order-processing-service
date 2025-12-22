import { CustomerOutput } from "@/api/customers/models/customer";
import { Customer } from "@/domain/customers/models/entities";

export class CustomerMapper {
    public static toOutput(customer: Customer): CustomerOutput {
        const { id, name, email } = customer;
        return {
            id: id.toString(),
            name,
            email,
        };
    }
}
