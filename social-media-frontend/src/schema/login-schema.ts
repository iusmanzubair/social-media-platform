import { z } from "zod";

export const EmailSchema = z.object({
  email: z.string().email({
    message: "Invalid email"
  })
})

export const PasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password should be at least 8 characters"
  })
})

export type EmailType = z.infer<typeof EmailSchema>
export type PasswordType = z.infer<typeof PasswordSchema>
