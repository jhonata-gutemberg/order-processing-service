import { describe, expect, it } from "vitest";
import { UUID } from "@/domain/shared/models/value-objects";
import { validate as validateUUIDV4 } from "uuid";

describe("UUID", () => {
    it("should de able to create a new random uuid", () => {
        const uuid = UUID.random();

        expect(uuid).toBeInstanceOf(UUID);
        expect(validateUUIDV4(uuid.toString())).toBeTruthy();
    });

    it("should be able to create a new uuid from string", async () => {
        const stringUUID = "8660efc3-1064-4391-bbb0-f077f2ad161c";

        const uuid = await UUID.of(stringUUID);

        expect(uuid).toBeInstanceOf(UUID);
        expect(uuid.toString()).toBe(stringUUID);
    });

    it("should not be able to create a new uuid from a invalid string", async () => {
        const invalidUUID = "1234567890";

        const uuid = () => UUID.of(invalidUUID);

        await expect(uuid).rejects.toThrow();
    });
});
