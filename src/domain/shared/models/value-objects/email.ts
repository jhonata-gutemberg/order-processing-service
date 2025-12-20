import { IllegalArgumentException } from "@/domain/shared/models/exceptions";
import { StringValidator } from "@/domain/shared/validators";

export class Email {
    private constructor(private readonly value: string) {}

    public static of(value: string) {
        StringValidator.validate(value, "email");
        if (value.trim() === "") {
            throw new IllegalArgumentException("email is required");
        }
        if (
            !value.match(/^[a-zA-Z0-9]+[._-]?[a-zA-Z0-9]+@[a-z.]+\.[a-z]{2,}$/)
        ) {
            throw new IllegalArgumentException("invalid email address");
        }
        return new Email(value);
    }

    public toString() {
        return this.value;
    }
}
