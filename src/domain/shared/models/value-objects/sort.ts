export enum SortDirection {
    asc = "asc",
    desc = "desc",
}

export class Sort {
    private constructor(
        public readonly by: string,
        public readonly direction: SortDirection = SortDirection.asc,
    ) {}

    public static of(by?: string, direction?: string): Sort | undefined {
        if (typeof by === "string" && by.trim().length > 0) {
            let sortDirection: SortDirection | undefined;
            if (typeof direction == "string" && direction in SortDirection) {
                sortDirection =
                    SortDirection[direction as keyof typeof SortDirection];
            }
            return new Sort(by, sortDirection);
        }
    }

    public static isSort(sort: unknown) {
        return sort instanceof Sort;
    }
}
