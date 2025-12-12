import { describe, expect, it } from "vitest";
import { Pageable } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/customers/models/exceptions";

describe("Pageable", () => {
    it("should not be able to create a pageable if page is not a number", () => {
        const pageable = () => Pageable.of("1" as any, 10);

        expect(pageable).throws(
            IllegalArgumentException,
            "page must be a integer",
        );
    });

    it("should not be able to create a pageable if page is a double", () => {
        const pageable = () => Pageable.of(1.3, 10);

        expect(pageable).throws(
            IllegalArgumentException,
            "page must be a integer",
        );
    });

    it("should not be able to create a pageable if page is negative", () => {
        const pageable = () => Pageable.of(-1, 10);

        expect(pageable).throws(
            IllegalArgumentException,
            "page must not be negative",
        );
    });

    it("should not be able to create a pageable if size is not a number", () => {
        const pageable = () => Pageable.of(0, "10" as any);

        expect(pageable).throws(
            IllegalArgumentException,
            "size must be a positive integer",
        );
    });

    it("should not be able to create a pageable if size is a double", () => {
        const pageable = () => Pageable.of(0, 10.3);

        expect(pageable).throws(
            IllegalArgumentException,
            "size must be a positive integer",
        );
    });

    it("should not be able to create a pageable if size is zero", () => {
        const pageable = () => Pageable.of(0, 0);

        expect(pageable).throws(
            IllegalArgumentException,
            "size must be a positive integer",
        );
    });

    it("should not be able to create a pageable if size is negative", () => {
        const pageable = () => Pageable.of(0, -1);

        expect(pageable).throws(
            IllegalArgumentException,
            "size must be a positive integer",
        );
    });

    it("should not be able to create a pageable with a wrong instance of Sort", () => {
        const pageable = () => Pageable.of(0, 5, {} as any);

        expect(pageable).throws(
            IllegalArgumentException,
            "sort should be a instance of Sort",
        );
    });
});
