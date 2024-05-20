import { z } from "zod";

//schema for messages 

export const acceptMessageSchema = z.object({
    content: z
        .string()
        .min(10, {message: "content must be of atleast 10 characters"})
        .max(300, {message: "content must be no longer than 300 charcters"})
});