import React, { useState } from 'react';
import axios from 'axios';

function AddNote({ refreshNotes }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh

    if (!title || !content) {
      alert("Please fill both fields");
      return;
    }

    try {
      // Send data to backend
      await axios.post('http://localhost:5000/api/notes', {
        title: title,
        content: content
      });

      // Clear the input boxes
      setTitle("");
      setContent("");

      // Refresh the notes list in App.jsx
      refreshNotes(); 
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <form className="add-note-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Note Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Note Content" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        rows="3"
      ></textarea>
      <button type="submit">Add Note</button>
    </form>
  );
}

export default AddNote;
