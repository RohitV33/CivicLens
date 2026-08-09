// ============================================================
// validators/user.validator.js - USER PROFILE VALIDATORS (ZOD)
// ============================================================

import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  bio: z.string().max(300, "Bio cannot exceed 300 characters").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .regex(/\d/, "New password must contain at least one number")
    .regex(/[a-zA-Z]/, "New password must contain at least one letter"),
});
