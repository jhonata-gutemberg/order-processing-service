import { VString } from "@/domain/shared/models/value-objects";

export enum SortDirection {
    asc = "asc",
    desc = "desc",
}

export class Sort {
    private constructor(
        public readonly by: VString,
        public readonly direction: SortDirection,
    ) {}

    public static of(
        by: VString,
        direction: SortDirection = SortDirection.asc,
    ) {
        return new Sort(by, direction);
    }

    public static isSort(value: unknown) {
        return value instanceof Sort;
    }
}
