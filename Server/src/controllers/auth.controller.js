// ============================================================
// controllers/auth.controller.js - AUTH CONTROLLER
//
// WHAT IS A CONTROLLER?
// The controller is the function that directly handles an HTTP request.
// It:
//   1. Reads data from the request (req.body, req.params, etc.)
//   2. Calls the service to do the real work
//   3. Sends back a response (res.json(...))
//
// Think of the flow like this:
//   Client → Route → Controller → Service → Database
//                              ← ← ← ← ← ← ← ←
// ============================================================

import {
  registerService,
  loginService,
  googleAuthService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service.js";

// ---- POST /api/auth/register ----
export const registerUser = async (req, res, next) => {
  try {
    // req.body contains: { name, email, password }
    const user = await registerService(req.body);

    // 201 = Created (a new resource was successfully created)
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: user,
    });

  } catch (error) {
    // Pass the error to our global error handler (error.middleware.js)
    next(error);
  }
};

// ---- POST /api/auth/login ----
export const loginUser = async (req, res, next) => {
  try {
    // req.body contains: { email, password }
    const { token, user } = await loginService(req.body);

    // 200 = OK
    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,  // the client should save this token and send it with future requests
      data: user,
    });

  } catch (error) {
    next(error);
  }
};

// ---- POST /api/auth/google ----
export const googleLoginUser = async (req, res, next) => {
  try {
    const { token } = req.body;
    const { token: jwtToken, user } = await googleAuthService(token);

    res.status(200).json({
      success: true,
      message: "Authenticated with Google successfully!",
      token: jwtToken,
      data: user,
    });

  } catch (error) {
    next(error);
  }
};

// ---- POST /api/auth/forgot-password ----
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await forgotPasswordService(email);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ---- POST /api/auth/reset-password ----
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService(token, newPassword);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ---- POST /api/auth/logout ----
export const logoutUser = (req, res) => {
  // Since we use JWT (token-based auth), logout is handled on the CLIENT side
  // The client just deletes the token from storage
  // We just send a success message

  res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};
