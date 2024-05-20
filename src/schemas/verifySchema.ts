//verify schema

import { z } from "zod";

//verify schema
export const verifySchema = z.object({
    code: z.string().length(6, {message: "Verification code must be 6 digits"}),
});