import { string, z } from "zod"

export const registerDto = z
  .object({
    email: z.string().min(1, "Email is required").email(),
    login: z.string().min(1, "Login is required").max(18),
    phone: z.string().min(1, "Phone is required").max(14),
    password: z.string().min(8, "Password must have than 8 characters")
  })
  .required()

export const confirmationDto = z.object({
  credential: z.string().min(1, "Login or Email is required").max(30),
  password: z.string().optional()
})

export const emailLoginDto = z
  .object({
    credential: z.string().min(1, "Login or Email is required").max(30),
    code: z.string().min(6)
  })
  .required()

export const phoneLoginDto = z
  .object({
    credential: z.string().min(1, "Phone is required").max(30),
    code: z.string().min(6)
  })
  .required()

export const googleDto = z
  .object({
    id: string().min(1),
    email: z.string().min(1, "Email is required").email(),
    login: z.string().min(1, "Login is required")
  })
  .required()

export type RegisterDto = z.infer<typeof registerDto>
export type ConfirmationDto = z.infer<typeof confirmationDto>
export type EmailLoginDto = z.infer<typeof emailLoginDto>
export type PhoneLoginDto = z.infer<typeof phoneLoginDto>
export type GoogleDto = z.infer<typeof googleDto>
