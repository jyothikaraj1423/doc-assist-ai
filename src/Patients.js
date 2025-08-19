import React from 'react';
import './Patients.css';

export default function Patients({ patients = [], onSelect }) {
  const [filter, setFilter] = React.useState('all');
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [editPatient, setEditPatient] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});
  // Add patient modal state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [addForm, setAddForm] = React.useState({ name: '', age: '', email: '', lastVisit: '', condition: '', status: 'pending' });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    // Update patient in localStorage
    const saved = localStorage.getItem('docassist_patients');
    let localPatients = saved ? JSON.parse(saved) : [];
    const idx = localPatients.findIndex(p => p.email === editPatient.email);
    if (idx !== -1) {
      localPatients[idx] = { ...localPatients[idx], ...editForm };
      localStorage.setItem('docassist_patients', JSON.stringify(localPatients));
      window.location.reload(); // quick way to refresh view
    }
    setEditPatient(null);
    setEditForm({});
  };

  const handleDeletePatient = () => {
    const saved = localStorage.getItem('docassist_patients');
    let localPatients = saved ? JSON.parse(saved) : [];
    localPatients = localPatients.filter(p => p.email !== editPatient.email);
    localStorage.setItem('docassist_patients', JSON.stringify(localPatients));
    window.location.reload();
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddPatient = () => {
    if (!addForm.name || !addForm.email) {
      alert('Name and Email are required');
      return;
    }
    const newPatient = {
      ...addForm,
      id: Date.now() + Math.floor(Math.random() * 1000000),
    };
    // Add to localStorage
    const saved = localStorage.getItem('docassist_patients');
    const localPatients = saved ? JSON.parse(saved) : [];
    localPatients.push(newPatient);
    localStorage.setItem('docassist_patients', JSON.stringify(localPatients));
    setShowAddModal(false);
    setAddForm({ name: '', age: '', email: '', lastVisit: '', condition: '', status: 'pending' });
    window.location.reload();
  };

  // Filtering logic
  let filteredPatients = patients;
  if (filter === 'new') {
    filteredPatients = patients.filter(p => p.status.toLowerCase() === 'pending');
  } else if (filter === 'active') {
    filteredPatients = patients.filter(p => p.status.toLowerCase() === 'active');
  }
  console.log('All patients:', patients);
  console.log('Filtered (pending) patients:', filteredPatients);
  return (
    <div className="patients-container">
      <div className="patients-header">
        <h2>Patient Records</h2>
        <button className="add-patient-btn" onClick={() => setShowAddModal(true)}>+ Add Patient</button>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
        <label htmlFor="patient-filter" style={{fontWeight:'bold'}}>Filter:</label>
        <select
          id="patient-filter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ borderRadius: 6, padding: '4px 12px', fontSize: '1em' }}
        >
          <option value="all">All</option>
          <option value="new">New Appointments</option>
          <option value="active">Active Patients</option>
        </select>
      </div>
      <div className="patients-grid">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="patient-card">
            <div className="patient-header">
              <h3>{patient.name}</h3>
              <span className="patient-age">{patient.age} years</span>
            </div>
            <div className="patient-details">
              <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
              <p><strong>Condition:</strong> {patient.condition}</p>
              <p><strong>Status:</strong> <span className="status-active">{patient.status}</span></p>
            </div>
            <div className="patient-actions">
              <button className="view-btn" onClick={() => setSelectedPatient(patient)}>View Details</button>
              <button className="edit-btn" onClick={() => { setEditPatient(patient); setEditForm(patient); }}>Edit</button>
              <button className="consult-btn" onClick={() => onSelect && onSelect(patient)} style={{marginLeft:8}}>Start Consultation</button>
            </div>
          </div>
        ))}
        {/* View Details Modal */}
        {selectedPatient && (
          <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'#fff',padding:24,borderRadius:12,minWidth:320}}>
              <h3>Patient Details</h3>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
              <p><strong>Condition:</strong> {selectedPatient.condition}</p>
              <p><strong>Status:</strong> {selectedPatient.status}</p>
              <p><strong>Allergies:</strong> {selectedPatient.allergies || 'N/A'}</p>
              <p><strong>Current Medications:</strong> {selectedPatient.currentMedications || 'N/A'}</p>
              <p><strong>Medical History:</strong> {selectedPatient.medicalHistory || 'N/A'}</p>
              <p><strong>Family History:</strong> {selectedPatient.familyHistory || 'N/A'}</p>
              {selectedPatient.reason && <p><strong>Reason for Visit:</strong> {selectedPatient.reason}</p>}
              {selectedPatient.symptoms && <p><strong>Symptoms:</strong> {selectedPatient.symptoms}</p>}
              {selectedPatient.lifestyle && (
                <div>
                  <strong>Lifestyle:</strong>
                  <ul>
                    {selectedPatient.lifestyle.smoking && <li>Smoking: {selectedPatient.lifestyle.smoking}</li>}
                    {selectedPatient.lifestyle.alcohol && <li>Alcohol: {selectedPatient.lifestyle.alcohol}</li>}
                    {selectedPatient.lifestyle.exercise && <li>Exercise: {selectedPatient.lifestyle.exercise}</li>}
                  </ul>
                </div>
              )}
              {/* Add more personal questions as needed */}
              {selectedPatient.gender && <p><strong>Gender:</strong> {selectedPatient.gender}</p>}
              {selectedPatient.contact && <p><strong>Contact:</strong> {selectedPatient.contact}</p>}
              {selectedPatient.emergencyContact && <p><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact}</p>}
              {selectedPatient.insurance && <p><strong>Insurance:</strong> {selectedPatient.insurance}</p>}
              <button onClick={() => setSelectedPatient(null)} style={{marginTop:12}}>Close</button>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        {editPatient && (
          <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'#fff',padding:24,borderRadius:12,minWidth:320}}>
              <h3>Edit Patient</h3>
              <label>Name: <input name="name" value={editForm.name || ''} onChange={handleEditChange} /></label><br/>
              <label>Age: <input name="age" value={editForm.age || ''} onChange={handleEditChange} /></label><br/>
              <label>Email: <input name="email" value={editForm.email || ''} onChange={handleEditChange} /></label><br/>
              <label>Last Visit: <input name="lastVisit" value={editForm.lastVisit || ''} onChange={handleEditChange} /></label><br/>
              <label>Condition: <input name="condition" value={editForm.condition || ''} onChange={handleEditChange} /></label><br/>
              <label>Status: <input name="status" value={editForm.status || ''} onChange={handleEditChange} /></label><br/>
              <button onClick={handleEditSave} style={{marginTop:12,marginRight:8}}>Save</button>
              <button onClick={() => setEditPatient(null)} style={{marginTop:12,marginRight:8}}>Cancel</button>
              <button onClick={handleDeletePatient} style={{marginTop:12,background:'#e53e3e',color:'#fff',border:'none',borderRadius:6,padding:'6px 12px'}}>Delete</button>
            </div>
          </div>
        )}
      {/* Add Patient Modal */}
      {showAddModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:24,borderRadius:12,minWidth:320}}>
            <h3>Add Patient</h3>
            <label>Name: <input name="name" value={addForm.name} onChange={handleAddChange} /></label><br/>
            <label>Age: <input name="age" value={addForm.age} onChange={handleAddChange} /></label><br/>
            <label>Email: <input name="email" value={addForm.email} onChange={handleAddChange} /></label><br/>
            <label>Last Visit: <input name="lastVisit" value={addForm.lastVisit} onChange={handleAddChange} /></label><br/>
            <label>Condition: <input name="condition" value={addForm.condition} onChange={handleAddChange} /></label><br/>
            <label>Status: <input name="status" value={addForm.status} onChange={handleAddChange} /></label><br/>
            <button onClick={handleAddPatient} style={{marginTop:12,marginRight:8}}>Add</button>
            <button onClick={() => setShowAddModal(false)} style={{marginTop:12}}>Cancel</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
} 