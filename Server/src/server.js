// ============================================================
// server.js - THE ENTRY POINT OF YOUR APP
// This is the very first file that runs when you do "npm run dev"
// It loads environment variables and starts the HTTP server
// ============================================================

import dotenv from "dotenv";   // dotenv reads your .env file (PORT, DATABASE_URL, etc.)
import app from "./app.js";    // we import the express app we configured in app.js

// Load .env file FIRST before anything else
dotenv.config();

// Read PORT from .env, or default to 5000 if not set
const PORT = process.env.PORT || 5000;

// Start listening for HTTP requests
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});