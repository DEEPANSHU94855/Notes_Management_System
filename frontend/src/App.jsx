import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddNote from "./components/AddNote";
import NotesList from "./components/NotesList";
import api from "./api/client";
import "./App.css";

const DELETE_COMMIT_DELAY = 4000;

function App() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  const hasFetched = useRef(false);
  const deleteTimerRef = useRef(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/api/notes");
      setNotes(response.data);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Unable to load notes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, []);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(normalizedQuery) ||
        note.content.toLowerCase().includes(normalizedQuery),
    );
  }, [notes, query]);

  const handleAddNote = useCallback(async ({ title, content }) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      setError("Please provide both a title and content.");
      return false;
    }

    setError("");
    setIsCreating(true);

    const optimisticId = `temp-${Date.now()}`;
    const optimisticNote = {
      _id: optimisticId,
      title: trimmedTitle,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      optimistic: true,
    };

    setNotes((prev) => [optimisticNote, ...prev]);

    try {
      const response = await api.post("/api/notes", {
        title: trimmedTitle,
        content: trimmedContent,
      });

      setNotes((prev) =>
        prev.map((note) => (note._id === optimisticId ? response.data : note)),
      );
      return true;
    } catch (createError) {
      setNotes((prev) => prev.filter((note) => note._id !== optimisticId));
      setError(createError?.response?.data?.message || "Failed to add note.");
      return false;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const handleUpdateNote = useCallback(async (id, payload) => {
    const previousNote = notes.find((note) => note._id === id);
    if (!previousNote) return;

    const updatedOptimistic = {
      ...previousNote,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => prev.map((note) => (note._id === id ? updatedOptimistic : note)));

    try {
      const response = await api.put(`/api/notes/${id}`, payload);
      setNotes((prev) => prev.map((note) => (note._id === id ? response.data : note)));
      setError("");
    } catch (updateError) {
      setNotes((prev) => prev.map((note) => (note._id === id ? previousNote : note)));
      setError(updateError?.response?.data?.message || "Failed to update note.");
    }
  }, [notes]);

  const commitDelete = useCallback(async (noteToDelete) => {
    try {
      await api.delete(`/api/notes/${noteToDelete._id}`);
    } catch (deleteError) {
      // Restore if delete failed on server.
      setNotes((prev) => [noteToDelete, ...prev]);
      setError(deleteError?.response?.data?.message || "Delete failed. Note restored.");
    } finally {
      setPendingDelete(null);
      deleteTimerRef.current = null;
    }
  }, []);

  const handleDeleteRequest = useCallback((id) => {
    const noteToDelete = notes.find((note) => note._id === id);
    if (!noteToDelete) return;

    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
    }

    setNotes((prev) => prev.filter((note) => note._id !== id));
    setPendingDelete(noteToDelete);

    deleteTimerRef.current = setTimeout(() => {
      commitDelete(noteToDelete);
    }, DELETE_COMMIT_DELAY);
  }, [commitDelete, notes]);

  const handleUndoDelete = useCallback(() => {
    if (!pendingDelete) return;
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    setNotes((prev) => [pendingDelete, ...prev]);
    setPendingDelete(null);
  }, [pendingDelete]);

  return (
    <div className="page-shell">
      <main className="app-container">
        <section className="top-bar">
          <div>
            <p className="eyebrow">Notes Management</p>
            <h1>Capture ideas instantly</h1>
          </div>
          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              type="button"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              type="button"
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </section>

        <AddNote onAdd={handleAddNote} isSubmitting={isCreating} />

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
          viewMode={viewMode}
          onDelete={handleDeleteRequest}
          onUpdate={handleUpdateNote}
        />

        {pendingDelete ? (
          <div className="undo-toast" role="status" aria-live="polite">
            <span>Note deleted.</span>
            <button type="button" onClick={handleUndoDelete}>Undo</button>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
