import mongoose from "mongoose";

// Create a schema (blueprint) for the Note
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is compulsory
  },
  content: {
    type: String,
    required: true, // Content is compulsory
  }
});

// Create and export the model
const Note = mongoose.model("Note", noteSchema);
export default Note;
