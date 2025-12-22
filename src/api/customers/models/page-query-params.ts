import { Integer, SortDirection } from "@/domain/shared/models/value-objects";

export type PageQueryParams = {
    page?: number;
    size?: Integer;
    sortBy?: string;
    direction?: SortDirection;
};
