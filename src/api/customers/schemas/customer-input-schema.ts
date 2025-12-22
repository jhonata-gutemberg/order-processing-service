import { z } from "zod";
import { Name } from "@/domain/shared/models/value-objects";

export const CustomerInputSchema = z.object({
    name: z.transform(Name.of),
    email: z.any(),
});
