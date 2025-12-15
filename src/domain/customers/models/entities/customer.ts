import { Email, UUID } from "@/domain/customers/models/value-objects";
import { Name } from "@/domain/shared/models/value-objects/name";

export type CustomerProps = {
    id?: UUID;
    name: Name;
    email: Email;
};

export class Customer {
    private constructor(
        public readonly id: UUID = UUID.random(),
        public readonly name: Name,
        public readonly email: Email,
    ) {}

    public static create(props: CustomerProps) {
        const { id, name, email } = props;
        return new Customer(id, name, email);
    }
}
