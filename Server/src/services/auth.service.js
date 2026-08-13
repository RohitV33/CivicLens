// ============================================================
// services/auth.service.js - AUTH BUSINESS LOGIC
//
// WHAT IS A SERVICE?
// A service contains the "brain" / business logic of your feature.
// The controller just calls the service — it doesn't know HOW things work.
// The service handles HOW: database queries, password hashing, etc.
//
// This file has:
//   registerService() - creates a new user in the database
//   loginService()    - checks credentials and returns a JWT token
// ============================================================

import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---- REGISTER SERVICE ----
export const registerService = async (userData) => {

  // Destructure the data sent from the request body
  const { name, email, password } = userData;

  // Step 1: Check if a user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // We throw an error with a statusCode so our error middleware handles it
    const error = new Error("An account with this email already exists");
    error.statusCode = 400; // 400 = Bad Request
    throw error;
  }

  // Step 2: Hash (encrypt) the password
  // NEVER store plain-text passwords in the database!
  // bcrypt.hash(password, 10) → 10 is the "salt rounds" (how secure the hash is)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 3: Create the user in the database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // store the hashed version, not the original
      role: userData.role || "USER",
    },
    // Only return safe fields (never return password)
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

// ---- LOGIN SERVICE ----
export const loginService = async (userData) => {

  const { email, password } = userData;
  const cleanEmail = (email || "").trim();

  // Step 1: Find the user by email (case-insensitive)
  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: cleanEmail,
        mode: "insensitive",
      },
    },
  });

  // Step 2: If no user found → wrong email
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401; // 401 = Unauthorized
    throw error;
  }

  if (!user.password) {
    const error = new Error("This account was created using Google. Please log in with Google.");
    error.statusCode = 400;
    throw error;
  }

  // Step 3: Compare the password the user typed with the hashed password in DB
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Step 4: Create a JWT token with user's id, email, and role
  const jwtToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Step 5: Return token and safe user info (no password)
  return {
    token: jwtToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// ---- GOOGLE AUTH SERVICE ----
export const googleAuthService = async (googleToken) => {
  let googleId, email, name;

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID || undefined,
    });
    const payload = ticket.getPayload();
    googleId = payload.sub;
    email = payload.email;
    name = payload.name || payload.given_name || "Civic User";
  } catch (err) {
    const error = new Error("Invalid or expired Google token. " + err.message);
    error.statusCode = 401;
    throw error;
  }

  if (!email) {
    const error = new Error("Google account does not provide an email address.");
    error.statusCode = 400;
    throw error;
  }

  // Find user by email or googleId
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId },
        { email },
      ],
    },
  });

  if (user) {
    // Link googleId if missing
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }
  } else {
    // Register new user via Google
    user = await prisma.user.create({
      data: {
        name,
        email,
        googleId,
        password: null,
        role: "USER",
      },
    });
  }

  const jwtToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token: jwtToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// ---- FORGOT PASSWORD SERVICE ----
export const forgotPasswordService = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { message: "If your email is registered, you will receive a password reset token shortly." };
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: resetToken,
      expiresAt,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "🔐 CivicLens AI - Password Reset Request",
    text: `Hello ${user.name},\n\nYour password reset verification code is: ${resetToken}\n\nThis code will expire in 60 minutes.\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0f172a;">CivicLens AI Password Reset</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Your password reset code is:</p>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 8px;">
          ${resetToken}
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 15px;">This code will expire in 60 minutes.</p>
      </div>
    `,
  });

  return { message: "Password reset code sent to your email address!" };
};

// ---- RESET PASSWORD SERVICE ----
export const resetPasswordService = async (token, newPassword) => {
  if (!token || !newPassword) {
    const error = new Error("Reset token and new password are required");
    error.statusCode = 400;
    throw error;
  }

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    const error = new Error("Invalid or expired password reset code");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    }),
  ]);

  return { message: "Password reset successfully! You can now log in with your new password." };
};
