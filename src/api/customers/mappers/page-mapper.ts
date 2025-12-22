import { PageOutput } from "@/api/customers/models";
import { Page } from "@/domain/shared/models/value-objects";

export class PageMapper {
    public static toOutput<E, O>(
        page: Page<E>,
        contentMapper: (content: E) => O,
    ): PageOutput<O> {
        const { content, currentPage, pageSize, totalItems, totalPages } = page;
        return {
            content: content.map(contentMapper),
            currentPage: currentPage,
            pageSize: pageSize.value,
            totalItems: totalItems.value,
            totalPages: totalPages.value,
        };
    }
}
