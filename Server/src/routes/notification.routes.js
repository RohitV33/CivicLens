// ============================================================
// routes/notification.routes.js - NOTIFICATION ROUTES
// ============================================================

import express from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authMiddleware to ALL notification routes
router.use(authMiddleware);

// GET /api/notifications -> List user notifications & unread count
router.get("/", getUserNotifications);

// PATCH /api/notifications/read-all -> Mark all as read
router.patch("/read-all", markAllNotificationsAsRead);

// PATCH /api/notifications/:id/read -> Mark single notification as read
router.patch("/:id/read", markNotificationAsRead);

// DELETE /api/notifications/:id -> Delete a notification
router.delete("/:id", deleteNotification);

export default router;
