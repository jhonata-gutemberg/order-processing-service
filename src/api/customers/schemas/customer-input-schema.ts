import { z } from "zod";
import { Name } from "@/domain/shared/models/value-objects";
import { Email } from "@/domain/shared/models/value-objects";

export const CustomerInputSchema = z.object({
    name: z.transform(Name.of),
    email: z.transform(Email.of),
});
