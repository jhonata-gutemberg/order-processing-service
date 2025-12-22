import { IsInt, Min, validateOrReject } from "class-validator";
import { Integer, Sort } from "@/domain/shared/models/value-objects";
import { IllegalArgumentException } from "@/domain/shared/models/exceptions";

export class Pageable {
    @IsInt()
    @Min(0)
    public readonly page: number;

    private constructor(
        page: number,
        public readonly size: Integer,
        public readonly sort?: Sort,
    ) {
        this.page = page;
        if (!size.isPositive()) {
            throw new IllegalArgumentException(
                "size must be a positive Integer",
            );
        }
    }

    public static async of(
        page: number = 0,
        size: Integer = Integer.TEN,
        sort?: Sort,
    ) {
        const pageable = new Pageable(page, size, sort);
        await validateOrReject(pageable);
        return pageable;
    }
}
