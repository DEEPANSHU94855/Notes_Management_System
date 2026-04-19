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

  return (
    <div className="app-container">
      <h1>📒 My Notes App</h1>
      
      {/* Pass fetchNotes so AddNote can refresh the list after adding */}
      <AddNote refreshNotes={fetchNotes} />
      
      {/* Pass notes and fetchNotes so NotesList can display and delete */}
      <NotesList notes={notes} refreshNotes={fetchNotes} />
    </div>
  );
}

export default App;
