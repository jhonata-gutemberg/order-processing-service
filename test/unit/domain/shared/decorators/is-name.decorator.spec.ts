import { describe, expect, it } from "vitest";
import { getNameValidationError } from "@/domain/shared/decorators";

describe("getNameValidationError", () => {
    it("should not be able to create a name with empty value", () => {
        const error = getNameValidationError("   ");

        expect(error).toBe("name is required");
    });

    it("should not be able to create a name with a special characters", () => {
        const error = getNameValidationError("John@Doe");

        expect(error).toBe(
            "name must not contain numbers or special characters",
        );
    });

    it("should not be able to create a name if length is less than 2", () => {
        const error = getNameValidationError("J");

        expect(error).toBe("name must be at least 2 characters");
    });
});
