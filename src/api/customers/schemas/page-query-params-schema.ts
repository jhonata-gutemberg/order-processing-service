import { z } from "zod";
import { Integer, SortDirection } from "@/domain/shared/models/value-objects";

export const PageQueryParamsSchema = z.object({
    page: z
        .string()
        .transform((value) => Number(value))
        .optional(),
    size: z
        .string()
        .transform((value) => Number(value))
        .transform((value) => Integer.of(value, "size"))
        .optional(),
    sortBy: z.string().optional(),
    direction: z
        .string()
        .transform(
            (value) => SortDirection[value as keyof typeof SortDirection],
        )
        .optional(),
});
