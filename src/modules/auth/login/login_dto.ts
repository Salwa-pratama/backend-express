import { z } from "zod";

// ===== Request Schemas =====
export const LoginRequestSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password min 8 characters"),
  }),
});

export const RegisterRequestSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password min 8 characters"),
    name: z.string().min(1, "Name required"),
  }),
});

// ===== Response Schemas =====
export const UserResponseSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LoginResponseSchema = z.object({
  user: UserResponseSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

// ===== Types =====
export type LoginRequest = z.infer<typeof LoginRequestSchema>["body"];
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>["body"];
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
