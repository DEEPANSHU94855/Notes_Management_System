import React from 'react';
import axios from 'axios';

function NotesList({ notes, refreshNotes }) {

  const handleDelete = async (id) => {
    try {
      // Tell backend to delete the note with this specific ID
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      
      // Refresh the list after successful deletion
      refreshNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
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
        </div>
      ))}
    </div>
  );
}

export default NotesList;
