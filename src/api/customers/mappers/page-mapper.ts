import { Page } from "@/domain/shared/models/value-objects";

export class PageMapper {
    public static toOutput<E, O>(
        page: Page<E>,
        contentMapper: (content: E) => O,
    ): Page<O> {
        const { content, currentPage, pageSize, totalItems, totalPages } = page;
        return {
            content: content.map(contentMapper),
            currentPage,
            pageSize,
            totalItems,
            totalPages,
        };
    }
}
