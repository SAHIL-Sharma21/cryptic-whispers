import { z } from "zod";

//signin schema
//identifier is just like our username or email
export const signInSchame = z.object({
    identifier: z.string(),
    password: z.string(),
});