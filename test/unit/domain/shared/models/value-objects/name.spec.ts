import { describe, expect, it } from "vitest";
import { Name } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

describe("Name", () => {
    it("should not be able to create a name with empty value", () => {
        const name = () => Name.of("   ");

        expect(name).throws(IllegalArgumentException, "name is required");
    });

    it("should not be able to create a name with a special characters", () => {
        const name = () => Name.of("John@Doe");

        expect(name).throws(
            IllegalArgumentException,
            "name must not contain numbers or special characters",
        );
    });

    it("should not be able to create a name if length is less than 2", () => {
        const name = () => Name.of("J");

        expect(name).throws(
            IllegalArgumentException,
            "name must be at least 2 characters",
        );
    });
});
