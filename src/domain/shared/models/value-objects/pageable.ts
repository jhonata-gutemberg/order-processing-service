import { Integer, Sort } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

export class Pageable {
    private constructor(
        public readonly page: Integer,
        public readonly size: Integer,
        public readonly sort?: Sort,
    ) {
        if (page.isNegative()) {
            throw new IllegalArgumentException(
                "page must be a non negative Integer",
            );
        }
        if (!size.isPositive()) {
            throw new IllegalArgumentException(
                "size must be a positive Integer",
            );
        }
    }

    public static of(
        page: Integer = Integer.ZERO,
        size: Integer = Integer.TEN,
        sort?: Sort,
    ) {
        return new Pageable(page, size, sort);
    }
}
