import { z } from "zod";
import { Integer, SortDirection } from "@/domain/shared/models/value-objects";

export const PageQueryParamsSchema = z.object({
    page: z
        .any()
        .transform((value) => Integer.of(value, "page"))
        .optional(),
    size: z
        .any()
        .transform((value) => Integer.of(value, "size"))
        .optional(),
    sortBy: z.any().optional(),
    direction: z
        .string()
        .transform(
            (value) => SortDirection[value as keyof typeof SortDirection],
        )
        .optional(),
});
