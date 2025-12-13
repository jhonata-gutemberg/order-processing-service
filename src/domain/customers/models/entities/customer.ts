import { Email, UUID } from "@/domain/customers/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

export type CustomerProps = {
    id?: UUID;
    name: string;
    email: Email;
};

export class Customer {
    private readonly _id: UUID;
    private readonly _name: string;
    private readonly _email: Email;

    constructor(props: CustomerProps) {
        this.validate(props.name);
        this._id = props.id ?? UUID.random();
        this._name = props.name;
        this._email = props.email;
    }

    get id(): UUID {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get email(): Email {
        return this._email;
    }

    private validate(name: string) {
        if (name === undefined || name === null || name.trim() === "") {
            throw new IllegalArgumentException("name is required");
        }
        if (name.trim().length < 2) {
            throw new IllegalArgumentException(
                "name must be at least 2 characters",
            );
        }
        if (!name.match(/^[a-zA-Z ]+$/)) {
            throw new IllegalArgumentException(
                "name must not contain numbers or special characters",
            );
        }
    }
}
