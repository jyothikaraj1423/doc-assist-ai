import React, { useState, useRef } from 'react';
import './Dashboard.css';

export default function DoctorPortal({ userRole, patients = [], patientReports = {} }) {
  const [previewPatient, setPreviewPatient] = useState(null);

  // Referral State
  const [referrals, setReferrals] = useState([]);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [selectedPatientForReferral, setSelectedPatientForReferral] = useState(null);
  const [referralForm, setReferralForm] = useState({
    specialistType: '',
    specialistName: '',
    reason: '',
    urgency: 'normal',
    notes: '',
    appointmentDate: ''
  });

  // Available Specialists
  const specialists = [
    { type: 'Cardiologist', name: 'Dr. Sarah Johnson', specialty: 'Heart & Cardiovascular', availability: 'Mon-Fri' },
    { type: 'Dermatologist', name: 'Dr. Michael Chen', specialty: 'Skin Conditions', availability: 'Tue-Sat' },
    { type: 'Endocrinologist', name: 'Dr. Emily Rodriguez', specialty: 'Diabetes & Hormones', availability: 'Mon-Thu' },
    { type: 'Neurologist', name: 'Dr. David Kim', specialty: 'Brain & Nervous System', availability: 'Wed-Sat' },
    { type: 'Orthopedist', name: 'Dr. Lisa Thompson', specialty: 'Bones & Joints', availability: 'Mon-Fri' },
    { type: 'Psychiatrist', name: 'Dr. James Wilson', specialty: 'Mental Health', availability: 'Mon-Fri' },
    { type: 'Gastroenterologist', name: 'Dr. Maria Garcia', specialty: 'Digestive System', availability: 'Tue-Fri' },
    { type: 'Oncologist', name: 'Dr. Robert Brown', specialty: 'Cancer Treatment', availability: 'Mon-Fri' }
  ];

  // Referral Functions
  const handleReferralClick = (patient) => {
    setSelectedPatientForReferral(patient);
    setShowReferralForm(true);
    setReferralForm({
      specialistType: '',
      specialistName: '',
      reason: '',
      urgency: 'normal',
      notes: '',
      appointmentDate: ''
    });
  };

  const handleReferralSubmit = () => {
    if (!referralForm.specialistType || !referralForm.reason) {
      alert('Please fill in the specialist type and reason for referral.');
      return;
    }

    const newReferral = {
      id: Date.now(),
      patientId: selectedPatientForReferral.id,
      patientName: selectedPatientForReferral.name,
      specialistType: referralForm.specialistType,
      specialistName: referralForm.specialistName,
      reason: referralForm.reason,
      urgency: referralForm.urgency,
      notes: referralForm.notes,
      appointmentDate: referralForm.appointmentDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
      referringDoctor: 'Dr. manasaa' // Current doctor
    };

    setReferrals(prev => [newReferral, ...prev]);
    setShowReferralForm(false);
    setSelectedPatientForReferral(null);
    
    // Save to localStorage
    const savedReferrals = localStorage.getItem('docassist_referrals') || '[]';
    const allReferrals = JSON.parse(savedReferrals);
    allReferrals.unshift(newReferral);
    localStorage.setItem('docassist_referrals', JSON.stringify(allReferrals));
    
    alert('Referral submitted successfully!');
  };

  const handleReferralCancel = () => {
    setShowReferralForm(false);
    setSelectedPatientForReferral(null);
  };

  const updateReferralStatus = (referralId, newStatus) => {
    setReferrals(prev => prev.map(ref => 
      ref.id === referralId ? { ...ref, status: newStatus } : ref
    ));
    
    // Update localStorage
    const savedReferrals = localStorage.getItem('docassist_referrals') || '[]';
    const allReferrals = JSON.parse(savedReferrals);
    const updatedReferrals = allReferrals.map(ref => 
      ref.id === referralId ? { ...ref, status: newStatus } : ref
    );
    localStorage.setItem('docassist_referrals', JSON.stringify(updatedReferrals));
  };

  // Load referrals from localStorage on component mount
  React.useEffect(() => {
    const savedReferrals = localStorage.getItem('docassist_referrals');
    if (savedReferrals) {
      setReferrals(JSON.parse(savedReferrals));
    }
  }, []);

  if (userRole !== 'doctor') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h2>Doctor Portal</h2>
          <p>Only doctors can access this portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="portal-header">
          <h2>👨‍⚕️ Patient Referrals</h2>
          <p>Manage patient referrals to specialists</p>
        </div>
        
        {/* Referral Form Modal */}
        {showReferralForm && selectedPatientForReferral && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h4>Refer Patient: {selectedPatientForReferral.name}</h4>
              
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                  Specialist Type:
                </label>
                <select 
                  value={referralForm.specialistType}
                  onChange={(e) => setReferralForm(prev => ({...prev, specialistType: e.target.value}))}
                  style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd'}}
                >
                  <option value="">Select Specialist Type</option>
                  {specialists.map(spec => (
                    <option key={spec.type} value={spec.type}>{spec.type} - {spec.specialty}</option>
                  ))}
                </select>
              </div>

              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                  Specialist Name (Optional):
                </label>
                <input 
                  type="text"
                  value={referralForm.specialistName}
                  onChange={(e) => setReferralForm(prev => ({...prev, specialistName: e.target.value}))}
                  placeholder="Enter specialist name or leave blank for general referral"
                  style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd'}}
                />
              </div>

              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                  Reason for Referral: *
                </label>
                <textarea 
                  value={referralForm.reason}
                  onChange={(e) => setReferralForm(prev => ({...prev, reason: e.target.value}))}
                  placeholder="Describe the reason for referral..."
                  style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px'}}
                  required
                />
              </div>

              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                  Urgency:
                </label>
                <select 
                  value={referralForm.urgency}
                  onChange={(e) => setReferralForm(prev => ({...prev, urgency: e.target.value}))}
                  style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd'}}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                  Appointment Date (Optional):
                </label>
                <input 
                  type="date"
                  value={referralForm.appointmentDate}
                  onChange={(e) => setReferralForm(prev => ({...prev, appointmentDate: e.target.value}))}
                  style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd'}}
                />
              </div>

              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                  Additional Notes:
                </label>
                <textarea 
                  value={referralForm.notes}
                  onChange={(e) => setReferralForm(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Any additional notes for the specialist..."
                  style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px'}}
                />
              </div>

              <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                <button 
                  onClick={handleReferralCancel}
                  style={{padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReferralSubmit}
                  style={{padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                >
                  Submit Referral
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Available Specialists */}
        <div style={{marginBottom: '32px'}}>
          <h4>Available Specialists</h4>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px'}}>
            {specialists.map(spec => (
              <div key={spec.type} style={{
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <h5 style={{margin: '0 0 8px 0', color: '#495057'}}>{spec.name}</h5>
                <p style={{margin: '0 0 4px 0', fontSize: '0.9rem', color: '#6c757d'}}><strong>Specialty:</strong> {spec.specialty}</p>
                <p style={{margin: '0 0 4px 0', fontSize: '0.9rem', color: '#6c757d'}}><strong>Availability:</strong> {spec.availability}</p>
                <p style={{margin: '0', fontSize: '0.9rem', color: '#6c757d'}}><strong>Type:</strong> {spec.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Patient List for Referrals */}
        <div style={{marginBottom: '32px'}}>
          <h4>Select Patient for Referral</h4>
          <div style={{background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px #eee', overflow: 'hidden'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#f8f9fa'}}>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Name</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Age</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Condition</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Last Visit</th>
                  <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.id} style={{borderBottom: '1px solid #f1f3f4'}}>
                    <td style={{padding: '12px'}}>{patient.name}</td>
                    <td style={{padding: '12px'}}>{patient.age}</td>
                    <td style={{padding: '12px'}}>{patient.condition || '—'}</td>
                    <td style={{padding: '12px'}}>{patient.lastVisit || '—'}</td>
                    <td style={{padding: '12px'}}>
            <button
                        onClick={() => handleReferralClick(patient)}
                        style={{
                          padding: '6px 12px',
                          background: '#3182ce',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Refer to Specialist
            </button>
                    </td>
                  </tr>
          ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referrals List */}
            <div>
          <h4>Recent Referrals</h4>
          {referrals.length === 0 ? (
            <div style={{color: '#888', textAlign: 'center', padding: '32px', background: '#f8f9fa', borderRadius: '8px'}}>
              No referrals yet. Select a patient above to create a referral.
            </div>
          ) : (
            <div style={{background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px #eee'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f8f9fa'}}>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Patient</th>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Specialist</th>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Reason</th>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Urgency</th>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Status</th>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Date</th>
                    <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(referral => (
                    <tr key={referral.id} style={{borderBottom: '1px solid #f1f3f4'}}>
                      <td style={{padding: '12px'}}>{referral.patientName}</td>
                      <td style={{padding: '12px'}}>{referral.specialistType}</td>
                      <td style={{padding: '12px'}}>
                        <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          {referral.reason}
                        </div>
                      </td>
                      <td style={{padding: '12px'}}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          background: referral.urgency === 'emergency' ? '#dc3545' : 
                                     referral.urgency === 'urgent' ? '#fd7e14' : '#28a745',
                          color: '#fff'
                        }}>
                          {referral.urgency}
                        </span>
                      </td>
                      <td style={{padding: '12px'}}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          background: referral.status === 'pending' ? '#ffc107' : 
                                     referral.status === 'accepted' ? '#28a745' : 
                                     referral.status === 'completed' ? '#17a2b8' : '#6c757d',
                          color: '#fff'
                        }}>
                          {referral.status}
                          </span>
                        </td>
                      <td style={{padding: '12px', fontSize: '0.9rem'}}>
                        {new Date(referral.createdAt).toLocaleDateString()}
                        </td>
                      <td style={{padding: '12px'}}>
                        <select 
                          value={referral.status}
                          onChange={(e) => updateReferralStatus(referral.id, e.target.value)}
                          style={{padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd'}}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 