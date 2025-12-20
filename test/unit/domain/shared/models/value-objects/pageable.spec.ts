import { describe, expect, it } from "vitest";
import { Integer, Pageable } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

describe("Pageable", () => {
    it("should not be able to create a pageable if page is negative", () => {
        const pageable = () => Pageable.of(Integer.ONE.negative());

        expect(pageable).throws(
            IllegalArgumentException,
            "page must be a non negative Integer",
        );
    });

    it("should not be able to create a pageable if size is zero", () => {
        const pageable = () => Pageable.of(Integer.ZERO, Integer.ZERO);

        expect(pageable).throws(
            IllegalArgumentException,
            "size must be a positive Integer",
        );
    });

    it("should not be able to create a pageable if size is negative", () => {
        const pageable = () =>
            Pageable.of(Integer.ZERO, Integer.ONE.negative());

        expect(pageable).throws(
            IllegalArgumentException,
            "size must be a positive Integer",
        );
    });
});
