import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// 1. GET ALL NOTES
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find(); // Fetch all notes from database
    res.json(notes); // Send notes back to frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// 2. ADD A NEW NOTE
router.post("/", async (req, res) => {
  try {
    // Create a new Note using the data sent from frontend (req.body)
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content
    });
    
    // Save it to MongoDB
    await newNote.save();
    res.json(newNote); // Send the saved note back
  } catch (error) {
    res.status(500).json({ message: "Error saving note" });
  }
});

// 3. DELETE A NOTE
router.delete("/:id", async (req, res) => {
  try {
    // Find note by ID from URL and delete it
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

export default router;
