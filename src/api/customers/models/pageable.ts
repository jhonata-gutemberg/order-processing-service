import {
    Integer,
    Pageable,
    Sort,
    SortDirection,
} from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

export class PageableQueryParams {
    private constructor(
        public readonly page?: Integer,
        public readonly size?: Integer,
        public readonly sortBy?: string,
        public readonly direction?: SortDirection,
    ) {}

    public static parse(query: unknown) {
        if (!this.isObject(query)) {
            throw new IllegalArgumentException("query must be an object");
        }
        const {
            page: queryPage,
            size: querySize,
            sortBy: querySortBy,
            direction: queryDirection,
        } = query as any;
        const page =
            queryPage !== undefined
                ? Integer.of(Number(queryPage), "page")
                : undefined;
        const size =
            querySize !== undefined
                ? Integer.of(Number(querySize), "size")
                : undefined;
        const sortBy =
            querySortBy !== undefined ? String(querySortBy) : undefined;
        const direction =
            queryDirection !== undefined &&
            String(queryDirection) in SortDirection
                ? SortDirection[
                      String(queryDirection) as keyof typeof SortDirection
                  ]
                : undefined;
        return new PageableQueryParams(page, size, sortBy, direction);
    }

    private static isObject(value: unknown) {
        return typeof value === "object" && value !== null;
    }

    public toPageable() {
        return Pageable.of(
            this.page,
            this.size,
            Sort.of(this.sortBy, this.direction),
        );
    }
}
