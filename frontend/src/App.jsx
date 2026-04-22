import React, { useEffect, useState } from "react";
import AddNote from "./components/AddNote";
import NotesList from "./components/NotesList";
import api from "./api/client";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get("/api/notes");
        setNotes(response.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load notes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleAddNote = async ({ title, content }) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("Please enter both title and note.");
      return false;
    }

    try {
      setError("");
      setIsSubmitting(true);
      const response = await api.post("/api/notes", {
        title: trimmedTitle,
        content: trimmedContent,
      });
      setNotes((prev) => [response.data, ...prev]);
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add note.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async (id, payload) => {
    const trimmedTitle = payload.title.trim();
    const trimmedContent = payload.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("Title and note cannot be empty.");
      return false;
    }

    try {
      setError("");
      const response = await api.put(`/api/notes/${id}`, {
        title: trimmedTitle,
        content: trimmedContent,
      });
      setNotes((prev) => prev.map((note) => (note._id === id ? response.data : note)));
      return true;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update note.");
      return false;
    }
  };

  const handleDeleteNote = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await api.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete note.");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const lowerQuery = query.toLowerCase();
    return (
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <main className="app-container">
      <h1>Notes Management System</h1>
      <p className="subtitle">Create, edit and manage your notes easily.</p>

      <AddNote onAdd={handleAddNote} isSubmitting={isSubmitting} />

      <div className="toolbar">
        <input
          type="search"
          value={query}
          placeholder="Search notes..."
          onChange={(event) => setQuery(event.target.value)}
        />
        <span>{filteredNotes.length} notes</span>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      <NotesList
        notes={filteredNotes}
        isLoading={isLoading}
        onDelete={handleDeleteNote}
        onUpdate={handleUpdateNote}
      />
    </main>
  );
}

export default App;
