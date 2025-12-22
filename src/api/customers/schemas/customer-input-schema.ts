import { z } from "zod";

export const CustomerInputSchema = z.object({
    name: z.string(),
    email: z.email(),
});
