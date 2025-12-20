import { IllegalArgumentException } from "@/domain/shared/models/exceptions";
import { StringValidator } from "@/domain/shared/validators";

export class Name {
    constructor(private readonly value: string) {}

    public static of(value: string) {
        StringValidator.validate(value, "name");
        if (value.trim() === "") {
            throw new IllegalArgumentException("name is required");
        }
        if (value.trim().length < 2) {
            throw new IllegalArgumentException(
                "name must be at least 2 characters",
            );
        }
        if (!value.match(/^[a-zA-Z ]+$/)) {
            throw new IllegalArgumentException(
                "name must not contain numbers or special characters",
            );
        }
        return new Name(value);
    }

    public toString() {
        return this.value;
    }
}
