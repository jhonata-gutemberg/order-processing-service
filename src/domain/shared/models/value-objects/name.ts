import { VString } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

export class Name {
    constructor(private readonly name: VString) {}

    public static of(value: string) {
        const name = VString.of(value, "name");
        if (name.isEmpty()) {
            throw new IllegalArgumentException("name is required");
        }
        if (name.trim().length() < 2) {
            throw new IllegalArgumentException(
                "name must be at least 2 characters",
            );
        }
        if (!name.match(/^[a-zA-Z ]+$/)) {
            throw new IllegalArgumentException(
                "name must not contain numbers or special characters",
            );
        }
        return new Name(name);
    }

    public toString() {
        return this.name.value;
    }
}
