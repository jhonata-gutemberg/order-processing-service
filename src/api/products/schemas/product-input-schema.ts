import { z } from "zod";

export const ProductInputSchema = z.object({
    name: z.string(),
    price: z.number().min(0),
    stock: z.number().int().min(0),
});
