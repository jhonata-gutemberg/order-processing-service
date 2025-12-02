import { v4 as uuidV4, validate as validateUUIDV4 } from "uuid";
import { IllegalArgumentException } from "@domain/customers/models/exceptions";

export class UUID {
    private readonly value: string;

    private constructor(value: string) {
        if (!validateUUIDV4(value)) {
            throw new IllegalArgumentException(`${value} is not a valid UUID`);
        }
        this.value = value;
    }

    public static random() {
        return new UUID(uuidV4());
    }

    public static from(value: string) {
        return new UUID(value);
    }

    public toString() {
        return this.value;
    }
}
