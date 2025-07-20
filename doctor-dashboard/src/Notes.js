import React, { useState } from 'react';
import './Notes.css';

const initialNotes = [
  { id: 1, patient: 'John Smith', date: '2024-01-15', content: 'Patient reports improved blood pressure control. Continue current medication regimen.', type: 'Follow-up' },
  { id: 2, patient: 'Sarah Johnson', date: '2024-01-10', content: 'New patient consultation. Diagnosed with Type 2 diabetes. Started on metformin.', type: 'New Patient' },
  { id: 3, patient: 'Mike Davis', date: '2024-01-08', content: 'Asthma symptoms well controlled with current inhaler. No changes needed.', type: 'Follow-up' },
];

export default function Notes() {
  const [notes, setNotes] = useState(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({ patient: '', content: '', type: 'Follow-up' });

  const addNote = () => {
    if (newNote.patient && newNote.content) {
      const note = {
        id: notes.length + 1,
        ...newNote,
        date: new Date().toISOString().split('T')[0]
      };
      setNotes([note, ...notes]);
      setNewNote({ patient: '', content: '', type: 'Follow-up' });
      setShowForm(false);
    }
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Clinical Notes</h2>
        <button className="add-note-btn" onClick={() => setShowForm(true)}>+ Add Note</button>
      </div>
      
      {showForm && (
        <div className="note-form">
          <h3>Add New Note</h3>
          <input
            type="text"
            placeholder="Patient Name"
            value={newNote.patient}
            onChange={(e) => setNewNote({...newNote, patient: e.target.value})}
          />
          <select
            value={newNote.type}
            onChange={(e) => setNewNote({...newNote, type: e.target.value})}
          >
            <option value="Follow-up">Follow-up</option>
            <option value="New Patient">New Patient</option>
            <option value="Consultation">Consultation</option>
            <option value="Emergency">Emergency</option>
          </select>
          <textarea
            placeholder="Note content..."
            value={newNote.content}
            onChange={(e) => setNewNote({...newNote, content: e.target.value})}
          />
          <div className="form-actions">
            <button onClick={addNote} className="save-btn">Save Note</button>
            <button onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <div className="note-header">
              <h4>{note.patient}</h4>
              <span className="note-type">{note.type}</span>
            </div>
            <p className="note-date">{note.date}</p>
            <p className="note-content">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 