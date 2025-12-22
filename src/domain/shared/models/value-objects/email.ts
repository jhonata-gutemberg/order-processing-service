import { IsEmail, validateOrReject } from "class-validator";

export class Email {
    @IsEmail()
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static async of(value: string) {
        const email = new Email(value);
        await validateOrReject(email);
        return email;
    }

    public toString() {
        return this.value;
    }
}
