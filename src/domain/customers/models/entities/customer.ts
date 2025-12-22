import { IsEmail, IsUUID, validateOrReject } from "class-validator";
import { IsName } from "@/domain/shared/decorators";
import { UUIDGenerator } from "@/domain/shared/generators";

export type CustomerProps = {
    id?: string;
    name: string;
    email: string;
};

export class Customer {
    @IsUUID()
    public readonly id: string;

    @IsName()
    public readonly name: string;

    @IsEmail()
    public readonly email: string;

    private constructor(
        id: string = UUIDGenerator.generate(),
        name: string,
        email: string,
    ) {
        this.id = id;
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
