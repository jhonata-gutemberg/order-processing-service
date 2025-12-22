import { SortDirection } from "@/domain/shared/models/value-objects";

export type PageQueryParams = {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: SortDirection;
};
