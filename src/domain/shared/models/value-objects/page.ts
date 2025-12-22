import { Integer } from "@/domain/shared/models/value-objects/integer";

export class Page<T> {
    constructor(
        public readonly content: T[],
        public readonly currentPage: number,
        public readonly pageSize: Integer,
        public readonly totalItems: Integer,
        public readonly totalPages: Integer,
    ) {}
}
