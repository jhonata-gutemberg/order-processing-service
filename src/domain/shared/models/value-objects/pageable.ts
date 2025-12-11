import { Sort } from "@/domain/shared/models/value-objects";

export class Pageable {
    private constructor(
        public readonly page: number,
        public readonly size: number,
        public readonly sort?: Sort,
    ) {}

    public static of(page: number = 0, size: number = 10, sort?: Sort) {
        return new Pageable(page, size, sort);
    }
}
