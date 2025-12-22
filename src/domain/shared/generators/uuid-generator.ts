import { v4 as uuidV4 } from "uuid";

export class UUIDGenerator {
    public static generate() {
        return uuidV4();
    }
}
