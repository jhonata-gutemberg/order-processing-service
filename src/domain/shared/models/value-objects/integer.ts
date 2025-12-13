import { IllegalArgumentException } from "@/domain/shared/models/exceptions/illegal-argument-exception";

export class Integer {
    public static ZERO = Integer.of(0);
    public static ONE = Integer.of(1);
    public static TWO = Integer.of(2);
    public static FIVE = Integer.of(5);
    public static TEN = Integer.of(10);

    private constructor(public readonly value: number) {}

    public static of(value: number, fieldName?: string): Integer {
        if (!Number.isInteger(value)) {
            throw new IllegalArgumentException(
                `${fieldName ?? "value"} must be a integer`,
            );
        }
        return new Integer(value);
    }

    public static isInteger(value: unknown) {
        return value instanceof Integer;
    }

    public isPositive() {
        return this.value > 0;
    }

    public isNegative() {
        return this.value < 0;
    }

    public negative() {
        return new Integer(this.value * -1);
    }

    public multiply(other: Integer) {
        return new Integer(this.value * other.value);
    }
}
