// ============================================================
// validators/auth.validator.js - AUTHENTICATION VALIDATORS (ZOD)
// ============================================================

import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Full name is required" })
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim(),
  email: z
    .string({ required_error: "Email address is required" })
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter"),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
  token: z
    .string({ required_error: "Google ID token is required" })
    .min(1, "Token cannot be empty"),
});

