import { IllegalArgumentException } from "@domain/models/exceptions";

export class Email {
    private readonly value: string;

    private constructor(value: string) {
        if (
            !value.match("^[a-zA-Z0-9]+[._-]?[a-zA-Z0-9]+@[a-z.]+\\.[a-z]{2,}$")
        ) {
            throw new IllegalArgumentException("invalid email address");
        }
        this.value = value;
    }

    public static from(value: string) {
        return new Email(value);
    }

    public toString() {
        return this.value;
    }
}
