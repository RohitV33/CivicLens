// ============================================================
// validators/issue.validator.js - ISSUE VALIDATORS (ZOD)
// ============================================================

import { z } from "zod";

const CategoryEnum = z.enum([
  "POTHOLE",
  "GARBAGE",
  "STREETLIGHT",
  "WATER_LEAKAGE",
  "ROAD_DAMAGE",
  "SEWAGE",
  "DRAINAGE",
  "OTHER",
]);

const StatusEnum = z.enum([
  "PENDING",
  "REVIEWING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
]);

const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const createIssueSchema = z.object({
  title: z
    .string({ required_error: "Issue title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters")
    .trim(),
  description: z
    .string({ required_error: "Issue description is required" })
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description cannot exceed 2000 characters")
    .trim(),
  category: CategoryEnum.optional().default("OTHER"),
  priority: PriorityEnum.optional().default("MEDIUM"),
  imageUrl: z.string().url("Must be a valid image URL").optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  location: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  aiClassification: z.string().optional().nullable(),
  aiConfidence: z.coerce.number().min(0).max(100).optional().nullable(),
});

export const updateIssueSchema = createIssueSchema.partial();

export const updateStatusSchema = z.object({
  status: StatusEnum,
  comment: z.string().max(500, "Comment cannot exceed 500 characters").optional(),
});

export const updatePrioritySchema = z.object({
  priority: PriorityEnum,
});

export const assignIssueSchema = z.object({
  assignedToId: z.coerce.number({ required_error: "assignedToId is required" }).int().positive(),
});
