import { IsEnum, IsString, validateOrReject } from "class-validator";

export enum SortDirection {
    asc = "asc",
    desc = "desc",
}

export class Sort {
    @IsString()
    public readonly by: string;

    @IsEnum(SortDirection)
    public readonly direction: SortDirection;

    private constructor(by: string, direction: SortDirection) {
        this.by = by;
        this.direction = direction;
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
