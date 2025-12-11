export class Page<T> {
    constructor(
        public readonly content: T[],
        public readonly currentPage: number,
        public readonly pageSize: number,
        public readonly totalItems: number,
        public readonly totalPages: number,
    ) {}

    public map<O>(callback: (content: T) => O) {
        return new Page<O>(
            this.content.map(callback),
            this.currentPage,
            this.pageSize,
            this.totalItems,
            this.totalPages,
        );
    }
}
