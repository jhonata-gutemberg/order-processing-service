import { IsInt, Min, validateOrReject } from "class-validator";
import { Sort } from "@/domain/shared/models/value-objects";

export class Pageable {
    @IsInt()
    @Min(0)
    public readonly page: number;

    @IsInt()
    @Min(1)
    public readonly size: number;

    private constructor(
        page: number,
        size: number,
        public readonly sort?: Sort,
    ) {
        this.page = page;
        this.size = size;
    }

    public static async of(page: number = 0, size: number = 10, sort?: Sort) {
        const pageable = new Pageable(page, size, sort);
        await validateOrReject(pageable);
        return pageable;
    }
}
