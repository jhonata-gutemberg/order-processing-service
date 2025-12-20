import { Integer, SortDirection } from "@/domain/shared/models/value-objects";

export type PageQueryParams = {
    page?: Integer;
    size?: Integer;
    sortBy?: string;
    direction?: SortDirection;
};
