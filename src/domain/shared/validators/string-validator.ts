import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

export class StringValidator {
    public static validate(value: string, fieldName: string = "value") {
        if (value === undefined || value === null) {
            throw new IllegalArgumentException(`${fieldName} is required`);
        }
        if (!this.isString(value)) {
            throw new IllegalArgumentException(`${fieldName} must be a string`);
        }
    }

    private static isString(value: unknown) {
        return typeof value === "string";
    }
}
