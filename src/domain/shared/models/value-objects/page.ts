import { Integer } from "@/domain/shared/models/value-objects/integer";

export class Page<T> {
    constructor(
        public readonly content: T[],
        public readonly currentPage: Integer,
        public readonly pageSize: Integer,
        public readonly totalItems: Integer,
        public readonly totalPages: Integer,
    ) {}
}
