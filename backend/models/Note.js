import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1500,
  },
}, {
  timestamps: true,
});

noteSchema.index({ updatedAt: -1 });

const Note = mongoose.model("Note", noteSchema);
export default Note;
