import { describe, expect, it } from "vitest";
import { Integer, Pageable } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/customers/models/exceptions";

describe("Pageable", () => {
    it("should not be able to create a pageable if page is not a integer", () => {
        const pageable = () => Pageable.of("1" as any);

        expect(pageable).throws(
            IllegalArgumentException,
            "page must be a non negative Integer",
        );
    });

    it("should not be able to create a pageable if page is negative", () => {
        const pageable = () => Pageable.of(Integer.ONE.negative());

        expect(pageable).throws(
            IllegalArgumentException,
            "page must be a non negative Integer",
        );
    });

    it("should not be able to create a pageable if size is not a integer", () => {
        const pageable = () => Pageable.of(Integer.ZERO, "10" as any);

        expect(pageable).throws(
            IllegalArgumentException,
            "size must be a positive Integer",
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

    it("should not be able to create a pageable with a wrong instance of Sort", () => {
        const pageable = () =>
            Pageable.of(Integer.ZERO, Integer.TEN, {} as any);

        expect(pageable).throws(
            IllegalArgumentException,
            "sort should be a instance of Sort",
        );
    });
});
