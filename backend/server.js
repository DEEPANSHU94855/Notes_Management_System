import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import notesRoutes from "./routes/notesRoutes.js";

// Load environment variables (like Database URL)
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "200kb" }));

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notesApp")
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("Database connection error:", err));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/notes", notesRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
