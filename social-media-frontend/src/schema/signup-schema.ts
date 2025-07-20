import parsePhoneNumberFromString from "libphonenumber-js";
import { z } from "zod";

export const PhoneNumberSchema = z.object({
  phone: z.string().transform((arg, ctx) => {
    const phone = parsePhoneNumberFromString(arg, {
      //defaultCountry: 'PK',
      extract: false
    });

    if (phone && phone.isValid())
      return phone.number

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid phone number',
    });

    return z.NEVER
  })
})

export const ConfirmationCodeSchema = z.object({
  code: z.string().length(6, {
    message: "Invalid confirmation code"
  })
})

export const ConfirmPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password should be atleast 8 characters long"
  }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Password doesn't match",
  path: ["confirmPassword"]
})

export const UserDetailsSchema = z.object({
  name: z.string().max(50, {
    message: "Name should be at most 50 characters long"
  }),
  bio: z.string().max(100, {
    message: "Bio should be at most 100 characters long"
  }),
  username: z.string().max(20, {
    message: "Username should at most 20 characters long"
  })
})

export type PhoneNumberType = z.infer<typeof PhoneNumberSchema>
export type ConfirmationCodeType = z.infer<typeof ConfirmationCodeSchema>
export type ConfirmPasswordType = z.infer<typeof ConfirmPasswordSchema>
export type UserDetailsType = z.infer<typeof UserDetailsSchema>
