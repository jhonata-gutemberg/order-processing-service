import { z } from "zod";

export const OrderInputSchema = z.object({
    customerId: z.uuidv4(),
    items: z
        .array(
            z.object({
                productId: z.uuidv4(),
                quantity: z.number().int().min(1),
            }),
        )
        .min(1),
});
