import { describe, expect, it } from "vitest";
import { validate as validateUUIDV4 } from "uuid";
import { UUIDGenerator } from "@/domain/shared/generators";

describe("UUIDGenerator", () => {
    it("should de able to create a new random uuid", () => {
        const uuid = UUIDGenerator.generate();

        expect(validateUUIDV4(uuid)).toBeTruthy();
    });
});
