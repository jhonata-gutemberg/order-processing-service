import { UUID } from "@/domain/shared/models/value-objects";
import { IsEmail, validateOrReject } from "class-validator";
import { IsName } from "@/domain/shared/decorators";

export type CustomerProps = {
    id?: UUID;
    name: string;
    email: string;
};

export class Customer {
    @IsName()
    public readonly name: string;

    @IsEmail()
    public readonly email: string;

    private constructor(
        public readonly id: UUID = UUID.random(),
        name: string,
        email: string,
    ) {
        this.name = name;
        this.email = email;
    }

    public static async create(props: CustomerProps) {
        const { id, name, email } = props;
        const customer = new Customer(id, name, email);
        await validateOrReject(customer);
        return customer;
    }
}
