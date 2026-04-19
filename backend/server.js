import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

// Load environment variables (like Database URL)
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Allows server to understand JSON data

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notesApp")
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("Database connection error:", err));

// Routes
app.use("/api/notes", notesRoutes); // Any request to /api/notes goes to notesRoutes

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
