import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddNote from './components/AddNote';
import NotesList from './components/NotesList';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]); // State to store all notes

  // Fetch notes from Backend when the app loads
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes');
      setNotes(response.data); // Save the fetched notes into state
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Instant UI Update Functions
  const handleNoteAdded = (newNote) => setNotes(prev => [...prev, newNote]);
  const handleNoteDeleted = (id) => setNotes(prev => prev.filter(n => n._id !== id));
  const handleNoteUpdated = (updatedNote) => setNotes(prev => prev.map(n => n._id === updatedNote._id ? updatedNote : n));

  return (
    <div className="app-container">
      <h1>📒 My Notes App</h1>
      
      {/* Pass handleNoteAdded for Instant UI Update */}
      <AddNote onAdd={handleNoteAdded} />

       {/* Pass handlers for delete and update */}
       <NotesList notes={notes} onDelete={handleNoteDeleted} onUpdate={handleNoteUpdated} />
    </div>
  );
}

export default App;
