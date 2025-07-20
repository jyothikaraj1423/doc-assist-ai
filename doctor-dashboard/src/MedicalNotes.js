import React, { useState } from 'react';
import './MedicalNotes.css';

export default function MedicalNotes({ userRole }) {
  const [notes, setNotes] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      date: '2024-01-15',
      type: 'Progress Note',
      content: 'Patient reports chest pain and shortness of breath. EKG shows ST elevation. Immediate cardiac evaluation recommended.',
      fhirData: {
        resourceType: "Observation",
        status: "final",
        category: [{ coding: [{ code: "clinical-note", display: "Clinical Note" }] }],
        valueString: "Patient reports chest pain and shortness of breath. EKG shows ST elevation."
      },
      aiInsights: ['Cardiac emergency detected', 'ST elevation pattern identified'],
      medications: ['Aspirin', 'Nitroglycerin'],
      alerts: ['Critical: ST elevation detected']
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      date: '2024-01-14',
      type: 'Consultation Note',
      content: 'Follow-up visit for diabetes management. Blood glucose levels improved with current medication regimen.',
      fhirData: {
        resourceType: "Observation",
        status: "final",
        category: [{ coding: [{ code: "clinical-note", display: "Clinical Note" }] }],
        valueString: "Follow-up visit for diabetes management. Blood glucose levels improved."
      },
      aiInsights: ['Diabetes management improving', 'Medication compliance good'],
      medications: ['Metformin', 'Insulin'],
      alerts: []
    }
  ]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note => {
    const matchesFilter = filterType === 'all' || note.type.toLowerCase().includes(filterType);
    const matchesSearch = note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const generateAINote = () => {
    // Simulate AI note generation
    const newNote = {
      id: Date.now(),
      patientName: 'AI Generated',
      date: new Date().toISOString().split('T')[0],
      type: 'AI Generated Note',
      content: 'AI analysis of patient symptoms and vital signs suggests...',
      fhirData: {
        resourceType: "Observation",
        status: "final",
        category: [{ coding: [{ code: "ai-note", display: "AI Generated Note" }] }],
        valueString: "AI analysis of patient symptoms and vital signs suggests..."
      },
      aiInsights: ['AI analysis completed', 'Pattern recognition applied'],
      medications: [],
      alerts: []
    };
    setNotes([newNote, ...notes]);
  };

  return (
    <div className="medical-notes-container">
      <div className="medical-notes-content">
        {/* Header */}
        <div className="notes-header">
          <h2>📋 Medical Notes</h2>
          <p>FHIR-formatted medical notes with AI insights and processing</p>
        </div>

        {/* Controls */}
        <div className="notes-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="progress">Progress Notes</option>
              <option value="consultation">Consultation Notes</option>
              <option value="ai">AI Generated</option>
            </select>
          </div>
          <button className="generate-btn" onClick={generateAINote}>
            🤖 Generate AI Note
          </button>
        </div>

        {/* Notes Grid */}
        <div className="notes-grid">
          <div className="notes-list">
            <h3>Notes ({filteredNotes.length})</h3>
            <div className="notes-items">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="note-header">
                    <h4>{note.patientName}</h4>
                    <span className="note-date">{note.date}</span>
                  </div>
                  <div className="note-type">{note.type}</div>
                  <div className="note-preview">
                    {note.content.substring(0, 100)}...
                  </div>
                  {note.alerts.length > 0 && (
                    <div className="note-alerts">
                      <span className="alert-count">{note.alerts.length} alerts</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note Details */}
          <div className="note-details">
            {selectedNote ? (
              <>
                <div className="detail-header">
                  <h3>{selectedNote.patientName}</h3>
                  <span className="detail-date">{selectedNote.date}</span>
                </div>
                
                <div className="detail-type">{selectedNote.type}</div>
                
                <div className="detail-content">
                  <h4>Note Content</h4>
                  <p>{selectedNote.content}</p>
                </div>

                {/* AI Insights */}
                <div className="ai-insights">
                  <h4>🤖 AI Insights</h4>
                  <div className="insights-list">
                    {selectedNote.aiInsights.map((insight, index) => (
                      <div key={index} className="insight-item">
                        <span className="insight-icon">💡</span>
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medications */}
                {selectedNote.medications.length > 0 && (
                  <div className="medications">
                    <h4>💊 Medications Mentioned</h4>
                    <div className="medications-list">
                      {selectedNote.medications.map((med, index) => (
                        <span key={index} className="medication-tag">{med}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {selectedNote.alerts.length > 0 && (
                  <div className="note-alerts-detail">
                    <h4>⚠️ Alerts</h4>
                    <div className="alerts-list">
                      {selectedNote.alerts.map((alert, index) => (
                        <div key={index} className="alert-item critical">
                          {alert}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FHIR Data */}
                <div className="fhir-data">
                  <h4>📊 FHIR Data</h4>
                  <div className="fhir-display">
                    <pre>{JSON.stringify(selectedNote.fhirData, null, 2)}</pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">📋</div>
                <h3>Select a note to view details</h3>
                <p>Choose a note from the list to see its full content, AI insights, and FHIR data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 