import { IllegalArgumentException } from "@/domain/shared/models/exceptions";
import { VString } from "@/domain/shared/models/value-objects/index";

export class Email {
    private constructor(private readonly email: VString) {}

    public static of(value: string) {
        const validValue = VString.of(value, "email");
        if (validValue.isEmpty()) {
            throw new IllegalArgumentException("email is required");
        }
        if (
            !value.match(/^[a-zA-Z0-9]+[._-]?[a-zA-Z0-9]+@[a-z.]+\.[a-z]{2,}$/)
        ) {
            throw new IllegalArgumentException("invalid email address");
        }
        return new Email(validValue);
    }

    public toString() {
        return this.email.value;
    }
}
