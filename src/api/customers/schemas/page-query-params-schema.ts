import { z } from "zod";
import {
    Integer,
    SortDirection,
    VString,
} from "@/domain/shared/models/value-objects";

export const PageQueryParamsSchema = z.object({
    page: z
        .any()
        .transform((value) => Integer.of(value, "page"))
        .optional(),
    size: z
        .any()
        .transform((value) => Integer.of(value, "size"))
        .optional(),
    sortBy: z
        .any()
        .transform((value) => VString.of(value, "sortBy"))
        .optional(),
    direction: z
        .string()
        .transform(
            (value) => SortDirection[value as keyof typeof SortDirection],
        )
        .optional(),
});
