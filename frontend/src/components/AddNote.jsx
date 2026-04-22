import React, { useState } from 'react';
import axios from 'axios';

function AddNote({ onAdd }) {
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
      const response = await axios.post('/api/notes', {
        title: title,
        content: content
      });

      // Clear the input boxes instantly for UI responsiveness
      setTitle("");
      setContent("");

      // Refresh locally in App completely skipping the Server roundtrip
      onAdd(response.data); 
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
