export enum SortDirection {
    asc = "asc",
    desc = "desc",
}

export class Sort {
    private constructor(
        public readonly by: string,
        public readonly direction: SortDirection,
    ) {}

    public static of(by: string, direction: SortDirection = SortDirection.asc) {
        return new Sort(by, direction);
    }

    public static isSort(value: unknown) {
        return value instanceof Sort;
    }
}
