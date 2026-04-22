import React, { useState } from "react";

function NotesList({ notes, isLoading, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (id) => {
    const ok = await onUpdate(id, { title: editTitle, content: editContent });
    if (ok) {
      cancelEdit();
    }
  };

  if (isLoading) {
    return <p className="empty-state">Loading notes...</p>;
  }

  if (notes.length === 0) {
    return <p className="empty-state">No notes found. Create your first note.</p>;
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <article key={note._id} className="note-card">
          {editingId === note._id ? (
            <div className="edit-box">
              <input
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
              />
              <textarea
                rows="4"
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
              />
              <div className="actions">
                <button type="button" onClick={() => saveEdit(note._id)}>Save</button>
                <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="actions">
                <button type="button" onClick={() => startEdit(note)}>Edit</button>
                <button type="button" className="danger" onClick={() => onDelete(note._id)}>
                  Delete
                </button>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
}

export default NotesList;
