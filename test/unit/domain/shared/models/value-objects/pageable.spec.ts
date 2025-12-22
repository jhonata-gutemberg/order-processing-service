import { describe, expect, it } from "vitest";
import { Pageable } from "@/domain/shared/models/value-objects";

describe("Pageable", () => {
    it("should not be able to create a pageable if page is negative", async () => {
        const pageable = () => Pageable.of(-1);

        await expect(pageable).rejects.toThrow();
    });

    it("should not be able to create a pageable if size is zero", async () => {
        const pageable = () => Pageable.of(0, 0);

        await expect(pageable).rejects.toThrow();
    });

    it("should not be able to create a pageable if size is negative", async () => {
        const pageable = () => Pageable.of(0, -1);

        await expect(pageable).rejects.toThrow();
    });
});
