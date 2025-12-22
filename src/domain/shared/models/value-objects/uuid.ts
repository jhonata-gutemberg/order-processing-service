import { v4 as uuidV4 } from "uuid";
import { IsUUID, validateOrReject } from "class-validator";

export class UUID {
    @IsUUID()
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static random() {
        return new UUID(uuidV4());
    }

    public static async of(value: string) {
        const uuid = new UUID(value);
        await validateOrReject(uuid);
        return uuid;
    }

    public toString() {
        return this.value;
    }
}
