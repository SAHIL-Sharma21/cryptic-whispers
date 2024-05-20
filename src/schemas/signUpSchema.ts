//just defining schema for validation in the frontend and using zod as a library.

import {z} from 'zod';

//checking validation for our schema and will export
//checking if username is string and then further we can chain the property
export const usernameValidation = z
    .string()
    .min(2, "username must be atleast 2 characters")
    .max(20, "username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");



//signup ks schema validation
//created object so that we can check more than 1 property.
export const signUpValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email address"}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"}),
});