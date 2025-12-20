import { StringValidator } from "@/domain/shared/validators";

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
        StringValidator.validate(by);
        return new Sort(by, direction);
    }
}
