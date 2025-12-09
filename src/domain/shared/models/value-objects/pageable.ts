import { Sort } from "@/domain/shared/models/value-objects";

export class Pageable {
    private constructor(
        public readonly page: number,
        public readonly size: number,
        public readonly sort?: Sort,
    ) {}

    public static of(page: number, size: number, sort?: Sort) {
        return new Pageable(page, size, sort);
    }
}
