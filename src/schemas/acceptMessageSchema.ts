import { z } from "zod";

//schema for user aaccepting message

export const acceptMessageSchema = z.object({
    acceptMessages: z.boolean(),
});