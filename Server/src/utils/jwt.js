// ============================================================
// utils/jwt.js - JWT HELPER FUNCTIONS
//
// JWT = JSON Web Token
// When a user logs in, we give them a TOKEN (like a badge).
// On every future request, they send this token so we know who they are.
//
// This file has two helper functions:
//   generateToken() - creates a new token for a user
//   verifyToken()   - checks if a token is valid
// ============================================================

import jwt from "jsonwebtoken";

// ---- Generate a JWT token ----
// payload = the data we want to store inside the token (e.g. user id, role)
// The token expires in 7 days
export const generateToken = (payload) => {
  return jwt.sign(
    payload,                         // data stored in the token
    process.env.JWT_SECRET,          // secret key from .env (keep it safe!)
    { expiresIn: "7d" }              // token is valid for 7 days
  );
};

// ---- Verify a JWT token ----
// Returns the decoded data if valid, throws an error if invalid/expired
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
