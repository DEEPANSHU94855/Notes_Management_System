import React, { memo, useState } from "react";

function NotesList({ notes, isLoading, viewMode, onDelete, onUpdate }) {
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
    await onUpdate(id, { title: editTitle.trim(), content: editContent.trim() });
    cancelEdit();
  };

  if (isLoading) {
    return (
      <div className="notes-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton-card" />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return <p className="empty-state">No notes found. Create your first note.</p>;
  }

  return (
    <div className={viewMode === "list" ? "notes-list" : "notes-grid"}>
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
              <header className="card-head">
                <h3>{note.title}</h3>
                {note.optimistic ? <span className="sync-badge">Syncing...</span> : null}
              </header>
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

export default memo(NotesList);
