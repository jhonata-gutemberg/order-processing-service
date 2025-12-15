import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

export class VString {
    constructor(public readonly value: string) {}

    public static of(value: string, fieldName: string = "value") {
        if (value === undefined || value === null) {
            throw new IllegalArgumentException(`${fieldName} is required`);
        }
        if (!this.isString(value)) {
            throw new IllegalArgumentException(`${fieldName} must be a string`);
        }
        return new VString(value);
    }

    public static isString(value: unknown) {
        return typeof value === "string";
    }

    public isEmpty() {
        return this.value.trim() === "";
    }

    public trim() {
        return new VString(this.value.trim());
    }

    public length() {
        return this.value.length;
    }

    public match(expression: string | RegExp) {
        return this.value.match(expression);
    }
}
