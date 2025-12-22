export class Page<T> {
    constructor(
        public readonly content: T[],
        public readonly currentPage: number,
        public readonly pageSize: number,
        public readonly totalItems: number,
        public readonly totalPages: number,
    ) {}
}
