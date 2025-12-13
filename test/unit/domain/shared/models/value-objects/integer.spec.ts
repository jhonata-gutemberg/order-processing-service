import { describe, expect, it } from "vitest";
import { Integer } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

describe("Integer", () => {
    it("should be able to create a integer from a number", () => {
        const expectedNumber = 10;

        const integer = Integer.of(expectedNumber);

        expect(integer).toBeInstanceOf(Integer);
        expect(integer.value).toBe(expectedNumber);
    });

    it("should not be able to create a integer from a double", () => {
        const integer = () => Integer.of(10.3);

        expect(integer).throws(
            IllegalArgumentException,
            "value must be a integer",
        );
    });

    it("should not be able to create a integer from a string", () => {
        const integer = () => Integer.of("10" as any);

        expect(integer).throws(
            IllegalArgumentException,
            "value must be a integer",
        );
    });

    it("should be able to throw an exception with field name", () => {
        const integer = () => Integer.of("10" as any, "field");

        expect(integer).throws(
            IllegalArgumentException,
            "field must be a integer",
        );
    });
});
