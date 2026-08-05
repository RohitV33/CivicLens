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
import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.js";

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
    },
    // Only return these fields (never return the password to the client!)
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

// ---- LOGIN SERVICE ----
export const loginService = async (userData) => {

  const { email, password } = userData;

  // Step 1: Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Step 2: If no user found → wrong email
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401; // 401 = Unauthorized
    throw error;
  }

  // Step 3: Compare the password the user typed with the hashed password in DB
  // bcrypt.compare() returns true if they match
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Step 4: Create a JWT token with the user's id and role inside it
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role || "USER", // role defaults to "USER"
  });

  // Step 5: Return token and safe user info (no password)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};