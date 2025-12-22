import { z } from "zod";

export const UpdateProductStockInputSchema = z.object({
    stock: z.number().int().min(0),
});
