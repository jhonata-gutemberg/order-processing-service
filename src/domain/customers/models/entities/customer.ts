import { Name, Email, UUID } from "@/domain/shared/models/value-objects";

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
