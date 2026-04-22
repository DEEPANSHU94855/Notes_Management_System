import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const notes = await Note.find(filter).sort({ updatedAt: -1 }).lean();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error saving note", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const content = req.body.content?.trim();
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

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
