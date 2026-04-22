import React, { memo, useState } from "react";

function AddNote({ onAdd, isSubmitting }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onAdd({ title, content });
    if (success) {
      setTitle("");
      setContent("");
    }
  };

  return (
    <form className="add-note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength={80}
      />
      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows="4"
        maxLength={1500}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add Note"}
      </button>
    </form>
  );
}

export default memo(AddNote);
