// ============================================================
// controllers/user.controller.js - USER CONTROLLER
//
// Handles requests related to users.
// These routes are protected by authMiddleware (must be logged in)
// ============================================================

import prisma from "../lib/prisma.js";

// ---- GET /api/users/profile ----
// Returns the currently logged-in user's profile
// req.user is set by authMiddleware (contains { id, email, role })
export const getMyProfile = async (req, res, next) => {
  try {
    // Get the user id from the JWT token (set by auth middleware)
    const userId = req.user.id;

    // Find the user in the database by their id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Only return safe fields (exclude password)
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        location: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    next(error);
  }
};

// ---- PATCH /api/users/profile ----
// Updates the logged-in user's profile
export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, avatarUrl, bio, location } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        location: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: updatedUser,
    });

  } catch (error) {
    next(error);
  }
};


// ---- GET /api/users/all ----
// Returns ALL users in the database
// ADMIN ONLY - protected by authorize("ADMIN") in the route
export const getAllUsers = async (req, res, next) => {
  try {
    // Get all users from database (excluding passwords)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      count: users.length, // helpful to know how many records were returned
      data: users,
    });

  } catch (error) {
    next(error);
  }
};