import { Sort } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/customers/models/exceptions";

export class Pageable {
    private constructor(
        public readonly page: number,
        public readonly size: number,
        public readonly sort?: Sort,
    ) {
        if (!Number.isInteger(page)) {
            throw new IllegalArgumentException("page must be a integer");
        }
        if (page < 0) {
            throw new IllegalArgumentException("page must not be negative");
        }
        if (!Number.isInteger(size) || size <= 0) {
            throw new IllegalArgumentException(
                "size must be a positive integer",
            );
        }
        if (sort !== undefined && !this.isSort(sort)) {
            throw new IllegalArgumentException(
                "sort should be a instance of Sort",
            );
        }
    }

    public static of(page: number = 0, size: number = 10, sort?: Sort) {
        return new Pageable(page, size, sort);
    }

    private isSort(sort: unknown) {
        return sort instanceof Sort;
    }
}
