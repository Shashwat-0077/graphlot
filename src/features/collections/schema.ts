import { z } from "zod";

export const CollectionSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
});
