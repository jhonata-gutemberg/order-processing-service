import { IsString, validateOrReject } from "class-validator";

export enum SortDirection {
    asc = "asc",
    desc = "desc",
}

export class Sort {
    @IsString()
    public readonly by: string;

    private constructor(
        by: string,
        public readonly direction: SortDirection,
    ) {
        this.by = by;
    }

    public static async of(
        by: string,
        direction: SortDirection = SortDirection.asc,
    ) {
        const sort = new Sort(by, direction);
        await validateOrReject(sort);
        return sort;
    }
}
