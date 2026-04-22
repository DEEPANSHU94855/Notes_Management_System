import React, { useEffect, useState } from "react";
import AddNote from "./components/AddNote";
import NotesList from "./components/NotesList";
import api from "./api/client";
import "./App.css";

function AuthForm({ mode, onSubmit, isSubmitting, onSwitchMode, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ email, password });
  };

  return (
    <main className="app-container auth-container">
      <h1>{mode === "login" ? "Login" : "Signup"}</h1>
      <p className="subtitle">Use your email and password to continue.</p>

      <form className="add-note-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Signup"}
        </button>
      </form>

      {error ? <p className="error-banner">{error}</p> : null}

      <p className="auth-switch-text">
        {mode === "login" ? "No account?" : "Already have an account?"}{" "}
        <button type="button" className="link-button" onClick={onSwitchMode}>
          {mode === "login" ? "Signup" : "Login"}
        </button>
      </p>
    </main>
  );
}

function App() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/notes");
        setNotes(response.data);
      } catch (err) {
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          setToken(null);
          setUserEmail("");
        }
        setError(err?.response?.data?.message || "Failed to load notes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  const handleAuthSubmit = async ({ email, password }) => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      const endpoint = authMode === "login" ? "/api/login" : "/api/signup";
      const response = await api.post(endpoint, { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", response.data.user.email);
      setToken(response.data.token);
      setUserEmail(response.data.user.email);
      setQuery("");
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken(null);
    setUserEmail("");
    setNotes([]);
    setQuery("");
    setError("");
  };

  if (!token) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuthSubmit}
        isSubmitting={isSubmitting}
        onSwitchMode={() => {
          setError("");
          setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
        }}
        error={error}
      />
    );
  }

  return (
    <main className="app-container">
      <div className="header-row">
        <div>
          <h1>Notes Management System</h1>
          <p className="subtitle">Create, edit and manage your notes easily.</p>
          <p className="subtitle small-text">Logged in as: {userEmail}</p>
        </div>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>

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
