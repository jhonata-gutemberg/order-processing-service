export type PageOutput<T> = {
    content: T[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
};
