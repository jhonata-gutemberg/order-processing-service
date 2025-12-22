import { z } from "zod";
import { Integer, SortDirection } from "@/domain/shared/models/value-objects";

export const PageQueryParamsSchema = z.object({
    page: z.string().transform(Number).optional(),
    size: z.string().transform(Number).optional(),
    sortBy: z.string().optional(),
    direction: z
        .string()
        .transform(
            (value) => SortDirection[value as keyof typeof SortDirection],
        )
        .optional(),
});
