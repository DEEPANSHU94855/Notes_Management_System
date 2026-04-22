import React from 'react';
import axios from 'axios';

function NotesList({ notes, onDelete, onUpdate }) {

  const handleDelete = async (id) => {
    try {
      // Tell backend to delete the note with this specific ID
      await axios.delete(`/api/notes/${id}`);
      // Optimistically update UI via parent handler
      onDelete(id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = async (note) => {
    const newTitle = prompt("Edit title", note.title) || note.title;
    const newContent = prompt("Edit content", note.content) || note.content;
    try {
      const response = await axios.put(`/api/notes/${note._id}`, { title: newTitle, content: newContent });
      onUpdate(response.data);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div>
      {notes.length === 0 ? <p>No notes found. Add one!</p> : null}
      
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          <div>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </div>
            <button className="delete-btn" onClick={() => handleDelete(note._id)}>
              Delete
            </button>
            <button className="delete-btn" style={{marginLeft: "5px"}} onClick={() => handleEdit(note)}>
              Edit
            </button>
        </div>
      ))}
    </div>
  );
}

export default NotesList;
