import { Name, UUID } from "@/domain/shared/models/value-objects";
import { IsEmail, validateOrReject } from "class-validator";

export type CustomerProps = {
    id?: UUID;
    name: Name;
    email: string;
};

export class Customer {
    @IsEmail()
    public readonly email: string;

    private constructor(
        public readonly id: UUID = UUID.random(),
        public readonly name: Name,
        email: string,
    ) {
        this.email = email;
    }

    public static async create(props: CustomerProps) {
        const { id, name, email } = props;
        const customer = new Customer(id, name, email);
        await validateOrReject(customer);
        return customer;
    }
}
