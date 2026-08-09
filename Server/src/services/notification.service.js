// ============================================================
// services/notification.service.js - NOTIFICATION BUSINESS LOGIC
// ============================================================

import prisma from "../lib/prisma.js";

// ---- Get Notifications for Logged-In User ----
export const getUserNotificationsService = async (userId) => {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        issue: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true,
          },
        },
      },
    }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
  ]);

  return {
    notifications,
    unreadCount,
  };
};

// ---- Mark Single Notification as Read ----
export const markNotificationAsReadService = async (notificationId, userId) => {
  if (isNaN(notificationId)) {
    const error = new Error("Invalid notification ID");
    error.statusCode = 400;
    throw error;
  }

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  if (notification.userId !== userId) {
    const error = new Error("Forbidden. You can only update your own notifications");
    error.statusCode = 403;
    throw error;
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return updatedNotification;
};

// ---- Mark All Notifications as Read ----
export const markAllNotificationsAsReadService = async (userId) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { message: "All notifications marked as read" };
};

// ---- Delete Notification ----
export const deleteNotificationService = async (notificationId, userId) => {
  if (isNaN(notificationId)) {
    const error = new Error("Invalid notification ID");
    error.statusCode = 400;
    throw error;
  }

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  if (notification.userId !== userId) {
    const error = new Error("Forbidden. You can only delete your own notifications");
    error.statusCode = 403;
    throw error;
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  return { message: "Notification deleted successfully" };
};
