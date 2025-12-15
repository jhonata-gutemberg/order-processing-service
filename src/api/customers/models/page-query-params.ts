import {
    Integer,
    SortDirection,
    VString,
} from "@/domain/shared/models/value-objects";

export type PageQueryParams = {
    page?: Integer;
    size?: Integer;
    sortBy?: VString;
    direction?: SortDirection;
};
