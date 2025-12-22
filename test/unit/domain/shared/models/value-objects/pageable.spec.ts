import { describe, expect, it } from "vitest";
import { Integer, Pageable } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

describe("Pageable", () => {
    it("should not be able to create a pageable if page is negative", async () => {
        const pageable = () => Pageable.of(-1);

        await expect(pageable).rejects.toThrow();
    });

    it("should not be able to create a pageable if size is zero", async () => {
        const pageable = () => Pageable.of(0, Integer.ZERO);

        await expect(pageable).rejects.throws(
            IllegalArgumentException,
            "size must be a positive Integer",
        );
    });

    it("should not be able to create a pageable if size is negative", async () => {
        const pageable = () => Pageable.of(0, Integer.ONE.negative());

        await expect(pageable).rejects.throws(
            IllegalArgumentException,
            "size must be a positive Integer",
        );
    });
});
