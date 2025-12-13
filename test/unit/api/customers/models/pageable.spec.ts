import { describe, expect, it } from "vitest";
import { PageableQueryParams } from "@/api/customers/models";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions/illegal-argument-exception";
import {
    Integer,
    Pageable,
    Sort,
    SortDirection,
} from "@/domain/shared/models/value-objects";

describe("PageableQueryParams", () => {
    it("should be able to parse a empty query to a pageable query params", () => {
        const query = {};

        const params = PageableQueryParams.parse(query);

        expect(params).toBeInstanceOf(PageableQueryParams);
        expect(params.page).toBeUndefined();
        expect(params.size).toBeUndefined();
        expect(params.sortBy).toBeUndefined();
        expect(params.direction).toBeUndefined();
    });

    it("should throw is query is not a object", () => {
        const query = "";

        const params = () => PageableQueryParams.parse(query);

        expect(params).throws(
            IllegalArgumentException,
            "query must be an object",
        );
    });

    it("should not be able to parse query to a pageable query params if page is a string", () => {
        Number();
        const query = {
            page: "invalid",
        };

        const params = () => PageableQueryParams.parse(query);

        expect(params).throws(
            IllegalArgumentException,
            "page must be a integer",
        );
    });

    it("should not be able to parse query to a pageable query params if page is a double", () => {
        Number();
        const query = {
            page: "10.3",
        };

        const params = () => PageableQueryParams.parse(query);

        expect(params).throws(
            IllegalArgumentException,
            "page must be a integer",
        );
    });

    it("should be able to parse query to a pageable query params if page is a integer", () => {
        Number();
        const query = {
            page: "10",
        };

        const params = PageableQueryParams.parse(query);

        expect(params).toBeInstanceOf(PageableQueryParams);
        expect(params.page).toBeInstanceOf(Integer);
        expect(params.page?.value).toBe(10);
    });

    it("should not be able to parse query to a pageable query params if size is a string", () => {
        Number();
        const query = {
            size: "invalid",
        };

        const params = () => PageableQueryParams.parse(query);

        expect(params).throws(
            IllegalArgumentException,
            "size must be a integer",
        );
    });

    it("should not be able to parse query to a pageable query params if size is a double", () => {
        Number();
        const query = {
            size: "10.3",
        };

        const params = () => PageableQueryParams.parse(query);

        expect(params).throws(
            IllegalArgumentException,
            "size must be a integer",
        );
    });

    it("should be able to parse query to a pageable query params if size is a integer", () => {
        Number();
        const query = {
            size: "10",
        };

        const params = PageableQueryParams.parse(query);

        expect(params).toBeInstanceOf(PageableQueryParams);
        expect(params.size).toBeInstanceOf(Integer);
        expect(params.size?.value).toBe(10);
    });

    it("should be able to parse sortBy to a string", () => {
        Number();
        const query = {
            sortBy: 10,
        };

        const params = PageableQueryParams.parse(query);

        expect(params).toBeInstanceOf(PageableQueryParams);
        expect(params.sortBy).toBe("10");
    });

    it("should be able to parse sortBy to a string", () => {
        Number();
        const query = {
            sortBy: 10,
        };

        const params = PageableQueryParams.parse(query);

        expect(params).toBeInstanceOf(PageableQueryParams);
        expect(params.sortBy).toBe("10");
    });

    it("should be able to parse direction to a SortDirection when direction is asc", () => {
        Number();
        const query = {
            direction: "asc",
        };

        const params = PageableQueryParams.parse(query);

        expect(params).toBeInstanceOf(PageableQueryParams);
        expect(params.direction).toBe(SortDirection.asc);
    });

    it("should be able to parse direction to a SortDirection when direction is desc", () => {
        Number();
        const query = {
            direction: "desc",
        };

        const params = PageableQueryParams.parse(query);

        expect(params).toBeInstanceOf(PageableQueryParams);
        expect(params.direction).toBe(SortDirection.desc);
    });

    it("should not be able to parse direction to a SortDirection when direction is invalid", () => {
        Number();
        const query = {
            direction: "invalid",
        };

        const params = PageableQueryParams.parse(query);

        expect(params).toBeInstanceOf(PageableQueryParams);
        expect(params.direction).toBeUndefined();
    });

    it("should be able to parse PageableQueryParams to a Pageable", () => {
        Number();
        const query = {
            page: "1",
            size: "5",
            sortBy: "name",
            direction: "desc",
        };
        const params = PageableQueryParams.parse(query);

        const pageable = params.toPageable();

        expect(pageable).toBeInstanceOf(Pageable);
        expect(pageable.page).toStrictEqual(Integer.ONE);
        expect(pageable.size).toStrictEqual(Integer.FIVE);
        expect(pageable.sort).toBeInstanceOf(Sort);
        expect(pageable.sort?.by).toBe("name");
        expect(pageable.sort?.direction).toBe(SortDirection.desc);
    });
});
