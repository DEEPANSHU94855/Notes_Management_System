import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// 1. GET ALL NOTES
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().lean(); // Fetch all notes from database (lean for performance)
    res.json(notes); // Send notes back to frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
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
    res.status(500).json({ message: "Error saving note", error: error.message });
  }
});

// 3. DELETE A NOTE
router.delete("/:id", async (req, res) => {
  try {
    // Find note by ID from URL and delete it
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
});

// 4. UPDATE A NOTE (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
});



export default router;
