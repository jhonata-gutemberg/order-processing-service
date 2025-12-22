import { Pageable, Sort } from "@/domain/shared/models/value-objects";
import { PageQueryParams } from "@/api/customers/models";

export class PageQueryParamsMapper {
    public static async toPageable(
        pageQueryParams: PageQueryParams,
    ): Promise<Pageable> {
        const { page, size, sortBy, direction } = pageQueryParams;
        const sort = sortBy ? await Sort.of(sortBy, direction) : undefined;
        return Pageable.of(page, size, sort);
    }
}
