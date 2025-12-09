export enum SortDirection {
    "asc",
    "desc",
}

export class Sort {
    private constructor(
        public readonly by: string,
        public readonly direction: SortDirection,
    ) {}

    public static of(by: string, direction: SortDirection = SortDirection.asc) {
        return new Sort(by, direction);
    }
}
