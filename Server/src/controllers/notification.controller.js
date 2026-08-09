// ============================================================
// controllers/notification.controller.js - NOTIFICATION CONTROLLER
// ============================================================

import {
  getUserNotificationsService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
  deleteNotificationService,
} from "../services/notification.service.js";

// GET /api/notifications
export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await getUserNotificationsService(userId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/notifications/:id/read
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user.id;

    const notification = await markNotificationAsReadService(notificationId, userId);

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/notifications/read-all
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await markAllNotificationsAsReadService(userId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const notificationId = parseInt(req.params.id);
    const userId = req.user.id;

    const result = await deleteNotificationService(notificationId, userId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
