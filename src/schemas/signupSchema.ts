import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Usesrname must be atleast 3 characters")
  .max(15, "Username must be no more than 15 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email addresss" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 character" }),
});
