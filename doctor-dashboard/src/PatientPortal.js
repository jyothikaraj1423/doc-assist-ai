import React, { useState, useEffect, useRef } from 'react';
import './PatientPortal.css';
import { v4 as uuidv4 } from 'uuid';

// Helper functions to extract info from FHIR report
function extractMedications(valueString) {
  const match = valueString && valueString.match(/Medications: ([^\n]*)/);
  return match ? match[1] : 'None';
}
function extractSymptoms(valueString) {
  const match = valueString && valueString.match(/Symptoms: ([^\n]*)/);
  return match ? match[1] : 'None';
}
function extractSummary(valueString) {
  const match = valueString && valueString.match(/Conversation:\n([\s\S]*)/);
  return match ? match[1] : valueString;
}

export default function PatientPortal({ userRole, patientInfo, setPatientInfo, patientReports = [], currentView, setCurrentView, onUpdatePatient, username, doctorUsername }) {
  // Enhanced state management for advanced features
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formInfo, setFormInfo] = useState(
    patientInfo && typeof patientInfo === 'object' ? {
      ...patientInfo,
      lifestyle: patientInfo.lifestyle || { smoking: '', alcohol: '', exercise: '' }
    } : {
      id: 1,
      name: '', age: '', gender: '', contact: '', reason: '', symptoms: '',
      emergencyContact: '', insurance: '', allergies: '', currentMedications: '',
      medicalHistory: '', familyHistory: '',
      lifestyle: { smoking: '', alcohol: '', exercise: '' }
    }
  );
  const [submitted, setSubmitted] = useState(!!(patientInfo && patientInfo.name));
  const [editMode, setEditMode] = useState(false);
  const [expandedReport, setExpandedReport] = useState(null);
  
  // Dynamic Question Flow State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionResponses, setQuestionResponses] = useState({});
  const [questionFlow, setQuestionFlow] = useState([]);
  
  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  // Medication Management State
  const [medications, setMedications] = useState([
    { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2024-01-01', endDate: '', notes: 'For blood pressure' },
    { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2024-01-15', endDate: '', notes: 'For diabetes' }
  ]);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', notes: '' });
  
  // Secure Messaging State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Get current patient name and doctor name
  const currentPatientName = patientInfo?.name || formInfo.name || username || 'Unknown Patient';
  const doctorName = doctorUsername ? `Dr. ${doctorUsername}` : 'Dr. manasaa';

  // Debug logging
  console.log('PatientPortal Debug:', {
    currentPatientName,
    doctorName,
    doctorUsername,
    patientInfo: patientInfo?.name,
    formInfoName: formInfo.name,
    username
  });

  // Update formInfo when patientInfo changes or when username is available
  useEffect(() => {
    if (patientInfo && patientInfo.name && patientInfo.name !== formInfo.name) {
      setFormInfo(prev => ({
        ...prev,
        name: patientInfo.name,
        age: patientInfo.age || prev.age,
        gender: patientInfo.gender || prev.gender,
        contact: patientInfo.contact || prev.contact,
        email: patientInfo.email || prev.email
      }));
    } else if (username && !formInfo.name && userRole === 'patient') {
      // If no patient name is set, use the username as the patient name
      setFormInfo(prev => ({
        ...prev,
        name: username,
        email: username + '@email.com'
      }));
    }
  }, [patientInfo, username, userRole, formInfo.name]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('docassist_messages');
    console.log('PatientPortal: Loading messages from localStorage:', savedMessages);
    
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      console.log('PatientPortal: Parsed messages:', parsedMessages);
      setMessages(parsedMessages);
    } else {
      // Initialize with sample messages if no messages exist
      const sampleMessages = [
        { 
          id: 1, 
          from: doctorName, 
          to: currentPatientName, 
          content: 'Hello! Your lab results are ready. Please schedule a follow-up appointment.', 
          timestamp: '2024-01-15 10:30', 
          read: false,
          senderRole: 'doctor'
        },
        { 
          id: 2, 
          from: currentPatientName, 
          to: doctorName, 
          content: 'Thank you, doctor. I have a question about my medication dosage.', 
          timestamp: '2024-01-15 14:20', 
          read: true,
          senderRole: 'patient'
        },
        { 
          id: 3, 
          from: doctorName, 
          to: currentPatientName, 
          content: 'Of course! What medication are you referring to? I can help adjust the dosage if needed.', 
          timestamp: '2024-01-15 15:45', 
          read: false,
          senderRole: 'doctor'
        }
      ];
      console.log('PatientPortal: Setting sample messages:', sampleMessages);
      setMessages(sampleMessages);
      localStorage.setItem('docassist_messages', JSON.stringify(sampleMessages));
    }
  }, [currentPatientName, doctorName]);

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    // Only set up interval if user is logged in and on Messages view
    if (!userRole || userRole !== 'patient' || currentView !== 'Messages') {
      return;
    }
    
    const interval = setInterval(() => {
      const savedMessages = localStorage.getItem('docassist_messages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Only update if messages have changed
        if (JSON.stringify(parsedMessages) !== JSON.stringify(messages)) {
          console.log('PatientPortal: Auto-refresh: New messages detected, updating...');
          setMessages(parsedMessages);
        }
      }
    }, 3000);

    return () => {
      console.log('Cleaning up PatientPortal auto-refresh interval');
      clearInterval(interval);
    };
  }, [messages, userRole, currentView]);

  // Auto-refresh when currentView changes to Messages
  useEffect(() => {
    if (currentView === 'Messages' && userRole === 'patient') {
      const savedMessages = localStorage.getItem('docassist_messages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        console.log('PatientPortal: View changed to Messages, refreshing messages:', parsedMessages);
        setMessages(parsedMessages);
      }
    }
  }, [currentView, userRole]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    console.log('PatientPortal: Saving messages to localStorage:', messages);
    localStorage.setItem('docassist_messages', JSON.stringify(messages));
  }, [messages]);

  // Get messages for current patient
  const patientMessages = messages.filter(msg => 
    (msg.from === currentPatientName && msg.to === doctorName) ||
    (msg.from === doctorName && msg.to === currentPatientName)
  );

  console.log('PatientPortal: Patient messages for', currentPatientName, ':', patientMessages);
  console.log('PatientPortal: All messages in state:', messages);
  console.log('PatientPortal: Filtering criteria - from:', currentPatientName, 'to:', doctorName);

  // Mark messages as read when viewing
  useEffect(() => {
    if (currentView === 'Messages') {
      setMessages(prev => prev.map(msg => 
        (msg.from === doctorName && msg.to === currentPatientName) 
          ? { ...msg, read: true }
          : msg
      ));
    }
  }, [currentView, currentPatientName, doctorName]);

  // Get unread count
  const getUnreadCount = () => {
    return messages.filter(msg => 
      msg.from === doctorName && 
      msg.to === currentPatientName && 
      !msg.read
    ).length;
  };
  
  // Health Tracker State
  const [healthData, setHealthData] = useState({
    vitals: [
      { date: '2024-01-15', bloodPressure: '120/80', heartRate: 72, temperature: 98.6, weight: 70 },
      { date: '2024-01-14', bloodPressure: '118/78', heartRate: 70, temperature: 98.4, weight: 70.2 }
    ],
    symptoms: [
      { date: '2024-01-15', symptom: 'Headache', severity: 'Mild', duration: '2 hours' },
      { date: '2024-01-14', symptom: 'Fatigue', severity: 'Moderate', duration: 'All day' }
    ]
  });
  
  // Data Control State
  const [dataSharing, setDataSharing] = useState({
    medicalRecords: true,
    labResults: true,
    prescriptions: false,
    visitNotes: true,
    emergencyContact: true
  });
  const [accessLog, setAccessLog] = useState([
    { date: '2024-01-15 14:30', provider: 'Dr. Smith', dataType: 'Medical Records', purpose: 'Routine checkup' },
    { date: '2024-01-14 10:15', provider: 'LabCorp', dataType: 'Lab Results', purpose: 'Blood work analysis' }
  ]);
  
  // Health Literacy Resources State
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources] = useState([
    { id: 1, title: 'Understanding Blood Pressure', type: 'video', duration: '5 min', description: 'Learn about normal ranges and what they mean' },
    { id: 2, title: 'Diabetes Management Guide', type: 'article', duration: '10 min', description: 'Comprehensive guide to managing diabetes' },
    { id: 3, title: 'Medication Safety Tips', type: 'interactive', duration: '8 min', description: 'Interactive quiz on medication safety' },
    { id: 4, title: 'Healthy Lifestyle Choices', type: 'video', duration: '12 min', description: 'Tips for maintaining a healthy lifestyle' }
  ]);

  // Dynamic Question Flow Configuration
  const dynamicQuestions = [
    {
      id: 1,
      question: "What brings you in today?",
      type: "text",
      required: true,
      followUp: (response) => {
        if (response.toLowerCase().includes('pain')) {
          return {
            id: 2,
            question: "On a scale of 1-10, how severe is your pain?",
            type: "number",
            min: 1,
            max: 10,
            required: true
          };
        }
        return null;
      }
    },
    {
      id: 3,
      question: "Have you experienced any of these symptoms in the last week?",
      type: "checkbox",
      options: ["Fever", "Cough", "Fatigue", "Nausea", "Dizziness", "None of the above"],
      required: true
    },
    {
      id: 4,
      question: "Are you currently taking any medications?",
      type: "radio",
      options: ["Yes", "No"],
      required: true,
      followUp: (response) => {
        if (response === "Yes") {
          return {
            id: 5,
            question: "Please list your current medications:",
            type: "textarea",
            required: true
          };
        }
        return null;
      }
    }
  ];

  const [reports, setReports] = useState(patientReports);
  const [shareLinks, setShareLinks] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('docassist_reportShareLinks') || '{}');
    }
    return {};
  });

  useEffect(() => {
    setFormInfo(patientInfo && typeof patientInfo === 'object' ? {
      ...patientInfo,
      lifestyle: patientInfo.lifestyle || { smoking: '', alcohol: '', exercise: '' }
    } : {
      id: 1,
      name: '', age: '', gender: '', contact: '', reason: '', symptoms: '',
      emergencyContact: '', insurance: '', allergies: '', currentMedications: '',
      medicalHistory: '', familyHistory: '',
      lifestyle: { smoking: '', alcohol: '', exercise: '' }
    });
    setSubmitted(!!(patientInfo && patientInfo.name));
    setQuestionFlow(dynamicQuestions);
    setReports(patientReports);
  }, [patientInfo, patientReports]);

  // Delete report handler
  const handleDeleteReport = (idx) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    const updatedReports = reports.filter((_, i) => i !== idx);
    setReports(updatedReports);
    // Update localStorage and parent state
    if (patientInfo && patientInfo.id) {
      // Update in localStorage
      const allReports = JSON.parse(localStorage.getItem('docassist_patientReports') || '{}');
      allReports[patientInfo.id] = updatedReports;
      localStorage.setItem('docassist_patientReports', JSON.stringify(allReports));
      // Optionally, trigger parent update if needed
      // if (typeof onUpdatePatient === 'function') onUpdatePatient(patientInfo);
    }
  };

  // Share report handler
  const handleShareReport = (idx) => {
    const report = reports[idx];
    const token = uuidv4();
    const newShareLinks = { ...shareLinks, [token]: { patientId: patientInfo.id, reportIdx: idx, active: true } };
    setShareLinks(newShareLinks);
    localStorage.setItem('docassist_reportShareLinks', JSON.stringify(newShareLinks));
    // Store token in report for UI (not persisted in report object)
    setReports(reports => reports.map((r, i) => i === idx ? { ...r, shareToken: token } : r));
  };

  // Revoke share handler
  const handleRevokeShare = (token) => {
    const newShareLinks = { ...shareLinks };
    if (newShareLinks[token]) newShareLinks[token].active = false;
    setShareLinks(newShareLinks);
    localStorage.setItem('docassist_reportShareLinks', JSON.stringify(newShareLinks));
    // Remove token from report in UI
    setReports(reports => reports.map(r => r.shareToken === token ? { ...r, shareToken: undefined } : r));
  };

  // Helper to get share link for a report
  const getShareLink = (token) => `${window.location.origin}/shared-report/${token}`;

  // Role-based access control
  if (userRole === 'doctor') {
    return (
      <div className="patient-portal-container">
        <div className="patient-portal-content">
          <h2>Patient Portal</h2>
          <p>Doctors cannot access the Patient Portal. Please use the dashboard to view patient details.</p>
        </div>
      </div>
    );
  }

  // Show warning if profile is incomplete
  const isProfileComplete = formInfo.name && formInfo.age && formInfo.gender && formInfo.contact;

  // Question Flow Handlers
  const handleQuestionResponse = (response) => {
    const currentQuestion = questionFlow[currentQuestionIndex];
    setQuestionResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));

    // Check for follow-up questions
    if (currentQuestion.followUp) {
      const followUp = currentQuestion.followUp(response);
      if (followUp) {
        setQuestionFlow(prev => [...prev, followUp]);
      }
    }

    // Move to next question
    if (currentQuestionIndex < questionFlow.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete the flow
      setActiveTab('dashboard');
    }
  };

  // File Upload Handlers
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      status: 'uploading'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    files.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => 
            f.id === newFiles[index].id ? { ...f, status: 'completed' } : f
          ));
        }
      }, 200);
    });
  };

  // Medication Management Handlers
  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setMedications(prev => [...prev, { ...newMedication, id: Date.now() }]);
      setNewMedication({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', notes: '' });
      setShowAddMedication(false);
    }
  };

  const removeMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  // Messaging Handlers
  const sendMessage = () => {
    if (newMessage.trim() && currentPatientName) {
      const message = {
        id: Date.now(),
        from: currentPatientName,
        to: doctorName,
        content: newMessage.trim(),
        timestamp: new Date().toLocaleString(),
        read: false,
        senderRole: 'patient'
      };
      console.log('PatientPortal: Sending message:', message);
      console.log('PatientPortal: Current messages before adding:', messages);
      
      const updatedMessages = [...messages, message];
      console.log('PatientPortal: Updated messages array:', updatedMessages);
      
      // Update state first
      setMessages(updatedMessages);
      setNewMessage('');
      
      // Force save to localStorage immediately
      localStorage.setItem('docassist_messages', JSON.stringify(updatedMessages));
      console.log('PatientPortal: Immediately saved to localStorage:', updatedMessages);
      
      // Verify it was saved
      const saved = localStorage.getItem('docassist_messages');
      console.log('PatientPortal: Verification - retrieved from localStorage:', saved);
      
      // Force a re-render by updating state again
      setTimeout(() => {
        const savedMessages = localStorage.getItem('docassist_messages');
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          console.log('PatientPortal: Reloading messages after timeout:', parsedMessages);
          setMessages(parsedMessages);
        }
      }, 100);
    } else {
      console.log('PatientPortal: Cannot send message - missing name or content:', {
        hasContent: !!newMessage.trim(),
        currentPatientName,
        newMessage
      });
    }
  };

  // Test message function


  // Health Tracker Handlers
  const addVitalReading = () => {
    const newReading = {
      date: new Date().toISOString().split('T')[0],
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      weight: 70
    };
    setHealthData(prev => ({
      ...prev,
      vitals: [newReading, ...prev.vitals]
    }));
  };

  const addSymptom = () => {
    const newSymptom = {
      date: new Date().toISOString().split('T')[0],
      symptom: 'New Symptom',
      severity: 'Mild',
      duration: '1 hour'
    };
    setHealthData(prev => ({
      ...prev,
      symptoms: [newSymptom, ...prev.symptoms]
    }));
  };

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInfo(prev => ({
      ...prev,
      [name]: value,
      lifestyle: prev.lifestyle || { smoking: '', alcohol: '', exercise: '' }
    }));
  };

  const handleLifestyleChange = (field, value) => {
    setFormInfo(prev => ({
      ...prev,
      lifestyle: { ...(prev.lifestyle || { smoking: '', alcohol: '', exercise: '' }), [field]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEditMode(false);
    setPatientInfo({ ...formInfo, id: formInfo.id, email: formInfo.email });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  // Show form if not submitted or in edit mode
  if (!submitted || editMode) {
    return (
      <div className="patient-portal-container">
        <div className="patient-portal-content">
          <div className="portal-header">
            <h2>📝 Enhanced Patient Intake Form</h2>
            <p>Complete your comprehensive health profile</p>
          </div>
          
          <div className="form-tabs">
            <button 
              className={activeTab === 'basic' ? 'active' : ''} 
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button 
              className={activeTab === 'medical' ? 'active' : ''} 
              onClick={() => setActiveTab('medical')}
            >
              Medical History
            </button>
            <button 
              className={activeTab === 'lifestyle' ? 'active' : ''} 
              onClick={() => setActiveTab('lifestyle')}
            >
              Lifestyle
            </button>
          </div>

          <form className="enhanced-intake-form" onSubmit={handleSubmit}>
            {activeTab === 'basic' && (
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <label>Full Name: <input name="name" value={formInfo.name} onChange={handleChange} required /></label>
                  <label>Age: <input name="age" type="number" value={formInfo.age} onChange={handleChange} required /></label>
            <label>Gender:
              <select name="gender" value={formInfo.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
                  <label>Contact: <input name="contact" value={formInfo.contact} onChange={handleChange} required /></label>
                  <label>Emergency Contact: <input name="emergencyContact" value={formInfo.emergencyContact} onChange={handleChange} /></label>
                  <label>Insurance: <input name="insurance" value={formInfo.insurance} onChange={handleChange} /></label>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="form-section">
                <h3>Medical Information</h3>
                <div className="form-grid">
                  <label>Allergies: <textarea name="allergies" value={formInfo.allergies} onChange={handleChange} placeholder="List any allergies..." /></label>
                  <label>Current Medications: <textarea name="currentMedications" value={formInfo.currentMedications} onChange={handleChange} placeholder="List current medications..." /></label>
                  <label>Medical History: <textarea name="medicalHistory" value={formInfo.medicalHistory} onChange={handleChange} placeholder="Previous conditions, surgeries..." /></label>
                  <label>Family History: <textarea name="familyHistory" value={formInfo.familyHistory} onChange={handleChange} placeholder="Family medical history..." /></label>
                </div>
              </div>
            )}

            {activeTab === 'lifestyle' && (
              <div className="form-section">
                <h3>Lifestyle Information</h3>
                <div className="form-grid">
                  <label>Smoking Status: 
                    <select value={formInfo.lifestyle?.smoking || ''} onChange={(e) => handleLifestyleChange('smoking', e.target.value)}>
                      <option value="">Select</option>
                      <option value="Never">Never</option>
                      <option value="Former">Former</option>
                      <option value="Current">Current</option>
                    </select>
                  </label>
                  <label>Alcohol Consumption: 
                    <select value={formInfo.lifestyle?.alcohol || ''} onChange={(e) => handleLifestyleChange('alcohol', e.target.value)}>
                      <option value="">Select</option>
                      <option value="None">None</option>
                      <option value="Occasional">Occasional</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Heavy">Heavy</option>
                    </select>
                  </label>
                  <label>Exercise Frequency: 
                    <select value={formInfo.lifestyle?.exercise || ''} onChange={(e) => handleLifestyleChange('exercise', e.target.value)}>
                      <option value="">Select</option>
                      <option value="None">None</option>
                      <option value="1-2 times/week">1-2 times/week</option>
                      <option value="3-4 times/week">3-4 times/week</option>
                      <option value="5+ times/week">5+ times/week</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            <div className="form-navigation">
              {activeTab !== 'basic' && (
                <button type="button" onClick={() => setActiveTab(activeTab === 'medical' ? 'basic' : 'medical')}>
                  Previous
                </button>
              )}
              {activeTab !== 'lifestyle' && (
                <button type="button" onClick={() => setActiveTab(activeTab === 'basic' ? 'medical' : 'lifestyle')}>
                  Next
                </button>
              )}
              {activeTab === 'lifestyle' && (
                <button type="submit" className="submit-btn">Submit Profile</button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show enhanced dashboard
  return (
    <div className="patient-portal-container">
      <div className="patient-portal-content">
        <div className="portal-header">
          <h2>👤 Enhanced Patient Portal</h2>
          <p>Your comprehensive health management dashboard</p>
        </div>
        {!isProfileComplete && (
          <div style={{background:'#fff3cd',color:'#856404',padding:'16px',borderRadius:'8px',margin:'16px 0',border:'1px solid #ffeeba',textAlign:'center'}}>
            <strong>⚠️ Please complete your profile for the best experience. Some features may be limited.</strong>
            <button style={{marginLeft:16,padding:'6px 16px',background:'#667eea',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}} onClick={handleEdit}>Edit Profile</button>
          </div>
        )}
        {/* Removed patient-portal-tabs (top navigation) */}

        {/* Render only the selected section */}
        <div className="tab-content">
          {currentView === 'Dashboard' && (
            <div className="dashboard-content">
              <div className="profile-card">
                <h3>👤 Personal Information</h3>
                <div className="info-grid">
                  <div><strong>Name:</strong> {formInfo.name}</div>
                  <div><strong>Age:</strong> {formInfo.age}</div>
                  <div><strong>Gender:</strong> {formInfo.gender}</div>
                  <div><strong>Contact:</strong> {formInfo.contact}</div>
                  <div><strong>Emergency Contact:</strong> {formInfo.emergencyContact || 'Not provided'}</div>
                  <div><strong>Insurance:</strong> {formInfo.insurance || 'Not provided'}</div>
                </div>
                <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
              </div>

              <div className="quick-actions">
                <h3>⚡ Quick Actions</h3>
                <div className="action-buttons">
                  <button onClick={() => setActiveTab('questions')}>Start Health Assessment</button>
                  <button onClick={() => setActiveTab('medications')}>Manage Medications</button>
                  <button onClick={() => setActiveTab('messages')}>Send Message</button>
                  <button onClick={() => setActiveTab('tracker')}>Log Health Data</button>
                </div>
              </div>

              <div className="recent-activity">
                <h3>📝 Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">💊</span>
                    <span>Medication reminder: Take Lisinopril at 9:00 AM</span>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📊</span>
                    <span>Blood pressure logged: 120/80</span>
                    <span className="activity-time">Yesterday</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">💬</span>
                    <span>Message received from {doctorName}</span>
                    <span className="activity-time">2 days ago</span>
                    {getUnreadCount() > 0 && (
                      <span className="unread-badge" style={{background:'#e53e3e',color:'white',padding:'2px 6px',borderRadius:'10px',fontSize:'0.7rem',marginLeft:'8px'}}>
                        {getUnreadCount()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical Reports Tab Section */}
          {currentView === 'Medical Reports' && (
            <div className="medical-reports-section">
              <h2>📄 Medical Reports</h2>
              {reports.length === 0 ? (
                <p>No medical reports available.</p>
              ) : (
                <ul style={{padding:0}}>
                  {reports.map((report, idx) => {
                    // Find if this report is shared
                    const token = report.shareToken || Object.keys(shareLinks).find(t => shareLinks[t].patientId === patientInfo.id && shareLinks[t].reportIdx === idx && shareLinks[t].active);
                    const isShared = token && shareLinks[token]?.active;
                    return (
                      <li key={idx} style={{background:'#f9f9f9',marginBottom:12,padding:16,borderRadius:8,listStyle:'none',boxShadow:'0 2px 8px #eee',position:'relative'}}>
                        <div><strong>Date:</strong> {report.date || report.effectiveDateTime ? new Date(report.date || report.effectiveDateTime).toLocaleString() : 'Unknown'}</div>
                        <div><strong>Symptoms:</strong> {Array.isArray(report.symptoms) ? report.symptoms.join(', ') : (report.symptoms || 'None')}</div>
                        <div><strong>Medications:</strong> {Array.isArray(report.medications) ? report.medications.join(', ') : (report.medications || 'None')}</div>
                        <div><strong>Notes:</strong> <pre style={{whiteSpace:'pre-wrap',background:'none',padding:0}}>{report.notes || (report.valueString || '')}</pre></div>
                        <button onClick={() => handleDeleteReport(idx)} style={{position:'absolute',top:8,right:8,background:'#e53e3e',color:'#fff',border:'none',borderRadius:4,padding:'4px 10px',cursor:'pointer'}}>Delete</button>
                        {!isShared ? (
                          <button onClick={() => handleShareReport(idx)} style={{position:'absolute',top:8,right:70,background:'#3182ce',color:'#fff',border:'none',borderRadius:4,padding:'4px 10px',cursor:'pointer'}}>Share</button>
                        ) : (
                          <>
                            <div style={{marginTop:8,background:'#e6f7ff',padding:'8px',borderRadius:4}}>
                              <span style={{fontSize:'0.95em'}}>Share Link: </span>
                              <input type="text" value={getShareLink(token)} readOnly style={{width:'60%'}} onFocus={e => e.target.select()} />
                              <button style={{marginLeft:8,padding:'2px 8px',borderRadius:4,border:'none',background:'#3182ce',color:'#fff',cursor:'pointer'}} onClick={() => {navigator.clipboard.writeText(getShareLink(token));}}>Copy</button>
                              <button style={{marginLeft:8,padding:'2px 8px',borderRadius:4,border:'none',background:'#e53e3e',color:'#fff',cursor:'pointer'}} onClick={() => handleRevokeShare(token)}>Revoke</button>
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {currentView === 'Health Assessment' && (
            <div className="questions-content">
              <h3>❓ Dynamic Health Assessment</h3>
              {currentQuestionIndex < questionFlow.length ? (
                <div className="question-card">
                  <h4>Question {currentQuestionIndex + 1} of {questionFlow.length}</h4>
                  <p className="question-text">{questionFlow[currentQuestionIndex].question}</p>
                  
                  {questionFlow[currentQuestionIndex].type === 'text' && (
                    <textarea 
                      placeholder="Enter your response..."
                      onChange={(e) => setQuestionResponses(prev => ({
                        ...prev,
                        [questionFlow[currentQuestionIndex].id]: e.target.value
                      }))}
                    />
                  )}
                  
                  {questionFlow[currentQuestionIndex].type === 'number' && (
                    <input 
                      type="number" 
                      min={questionFlow[currentQuestionIndex].min}
                      max={questionFlow[currentQuestionIndex].max}
                      placeholder={`Enter a number between ${questionFlow[currentQuestionIndex].min}-${questionFlow[currentQuestionIndex].max}`}
                      onChange={(e) => setQuestionResponses(prev => ({
                        ...prev,
                        [questionFlow[currentQuestionIndex].id]: e.target.value
                      }))}
                    />
                  )}
                  
                  {questionFlow[currentQuestionIndex].type === 'checkbox' && (
                    <div className="checkbox-group">
                      {questionFlow[currentQuestionIndex].options.map(option => (
                        <label key={option}>
                          <input 
                            type="checkbox" 
                            value={option}
                            onChange={(e) => {
                              const current = questionResponses[questionFlow[currentQuestionIndex].id] || [];
                              const updated = e.target.checked 
                                ? [...current, option]
                                : current.filter(item => item !== option);
                              setQuestionResponses(prev => ({
                                ...prev,
                                [questionFlow[currentQuestionIndex].id]: updated
                              }));
                            }}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {questionFlow[currentQuestionIndex].type === 'radio' && (
                    <div className="radio-group">
                      {questionFlow[currentQuestionIndex].options.map(option => (
                        <label key={option}>
                          <input 
                            type="radio" 
                            name={`question-${questionFlow[currentQuestionIndex].id}`}
                            value={option}
                            onChange={(e) => setQuestionResponses(prev => ({
                              ...prev,
                              [questionFlow[currentQuestionIndex].id]: e.target.value
                            }))}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  
                  <div className="question-navigation">
                    <button 
                      onClick={() => {
                        // If last question, save as appointment
                        if (currentQuestionIndex === questionFlow.length - 1) {
                          // Save as appointment
                          const updatedInfo = {
                            ...formInfo,
                            reason: questionResponses[1] || formInfo.reason,
                            condition: questionResponses[1] || formInfo.condition,
                            symptoms: Array.isArray(questionResponses[3]) ? questionResponses[3].join(', ') : questionResponses[3] || formInfo.symptoms,
                            currentMedications: questionResponses[5] || formInfo.currentMedications,
                            status: 'pending',
                            lastVisit: new Date().toISOString().split('T')[0],
                            id: formInfo.id,
                            email: formInfo.email
                          };
                          setPatientInfo(updatedInfo);
                          if (onUpdatePatient) onUpdatePatient(updatedInfo);
                          // Also update localStorage global patients list
                          const saved = localStorage.getItem('docassist_patients');
                          let localPatients = saved ? JSON.parse(saved) : [];
                          const idx = localPatients.findIndex(p => p.email === updatedInfo.email);
                          if (idx !== -1) {
                            localPatients[idx] = updatedInfo;
                          } else {
                            localPatients.push(updatedInfo);
                          }
                          localStorage.setItem('docassist_patients', JSON.stringify(localPatients));
                          console.log('After assessment, docassist_patients:', localPatients);
                          setCurrentQuestionIndex(currentQuestionIndex + 1); // Show completion message
                        } else {
                          handleQuestionResponse(questionResponses[questionFlow[currentQuestionIndex].id]);
                        }
                      }}
                      disabled={!questionResponses[questionFlow[currentQuestionIndex].id]}
                    >
                      {currentQuestionIndex === questionFlow.length - 1 ? 'Complete' : 'Next'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="assessment-complete">
                  <h4>✅ Assessment Submitted!</h4>
                  <p>Your health assessment has been sent to your doctor as an appointment.</p>
                  <button onClick={() => {
                    setCurrentQuestionIndex(0);
                    setQuestionResponses({});
                    setQuestionFlow(dynamicQuestions);
                  }}>
                    Start New Assessment
                  </button>
                </div>
              )}
            </div>
          )}

          {currentView === 'File Uploads' && (
            <div className="files-content">
              <h3>📁 File Upload Center</h3>
              <div className="upload-section">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <button 
                  className="upload-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  📁 Upload Files
                </button>
                <p>Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
              </div>

              <div className="uploaded-files">
                <h4>Uploaded Files</h4>
                {uploadedFiles.length === 0 ? (
                  <p>No files uploaded yet.</p>
                ) : (
                  <div className="file-list">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="file-item">
                        <span className="file-icon">📄</span>
                        <div className="file-info">
                          <div className="file-name">{file.name}</div>
                          <div className="file-details">
                            {file.size} bytes • {file.uploadDate}
                          </div>
                        </div>
                        <span className={`file-status ${file.status}`}>
                          {file.status === 'uploading' ? '⏳' : '✅'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'Medications' && (
            <div className="medications-content">
              <h3>💊 Medication Management</h3>
              
              <div className="medication-list">
                {medications.map(med => (
                  <div key={med.id} className="medication-card">
                    <div className="medication-info">
                      <h4>{med.name}</h4>
                      <p><strong>Dosage:</strong> {med.dosage}</p>
                      <p><strong>Frequency:</strong> {med.frequency}</p>
                      <p><strong>Start Date:</strong> {med.startDate}</p>
                      {med.endDate && <p><strong>End Date:</strong> {med.endDate}</p>}
                      {med.notes && <p><strong>Notes:</strong> {med.notes}</p>}
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeMedication(med.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {showAddMedication ? (
                <div className="add-medication-form">
                  <h4>Add New Medication</h4>
                  <div className="form-grid">
                    <input
                      placeholder="Medication name"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <input
                      placeholder="Dosage (e.g., 10mg)"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                    />
                    <input
                      placeholder="Frequency (e.g., Once daily)"
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                    />
                    <input
                      type="date"
                      value={newMedication.startDate}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                    <input
                      type="date"
                      placeholder="End date (optional)"
                      value={newMedication.endDate}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                    <textarea
                      placeholder="Notes (optional)"
                      value={newMedication.notes}
                      onChange={(e) => setNewMedication(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={addMedication}>Add Medication</button>
                    <button onClick={() => setShowAddMedication(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button 
                  className="add-medication-btn"
                  onClick={() => setShowAddMedication(true)}
                >
                  ➕ Add Medication
                </button>
              )}
            </div>
          )}

          {currentView === 'Messages' && (
            <div className="messages-content">
              <h3>💬 Secure Messaging</h3>
              
              <div className="message-list">
                {patientMessages.map(message => (
                  <div key={message.id} className={`message ${message.from === currentPatientName ? 'sent' : 'received'}`}>
                    <div className="message-header">
                      <span className="message-sender">{message.from}</span>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                    <div className="message-content">{message.content}</div>
                    {!message.read && message.from !== currentPatientName && (
                      <span className="unread-indicator">●</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="message-compose">
                <textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage} disabled={!newMessage.trim()}>
                  Send Message
                </button>
              </div>
            </div>
          )}

          {currentView === 'Health Tracker' && (
            <div className="tracker-content">
              <h3>📈 Health Tracker</h3>
              
              <div className="tracker-sections">
                <div className="vitals-section">
                  <h4>Vital Signs</h4>
                  <button onClick={addVitalReading} className="add-reading-btn">
                    ➕ Add Reading
                  </button>
                  <div className="vitals-list">
                    {healthData.vitals.map((vital, index) => (
                      <div key={index} className="vital-card">
                        <div className="vital-date">{vital.date}</div>
                        <div className="vital-readings">
                          <span>BP: {vital.bloodPressure}</span>
                          <span>HR: {vital.heartRate}</span>
                          <span>Temp: {vital.temperature}°F</span>
                          <span>Weight: {vital.weight}kg</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="symptoms-section">
                  <h4>Symptom Tracker</h4>
                  <button onClick={addSymptom} className="add-symptom-btn">
                    ➕ Add Symptom
                  </button>
                  <div className="symptoms-list">
                    {healthData.symptoms.map((symptom, index) => (
                      <div key={index} className="symptom-card">
                        <div className="symptom-date">{symptom.date}</div>
                        <div className="symptom-details">
                          <span className="symptom-name">{symptom.symptom}</span>
                          <span className={`severity ${symptom.severity.toLowerCase()}`}>
                            {symptom.severity}
                          </span>
                          <span className="duration">{symptom.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'Data Control' && (
            <div className="data-content">
              <h3>🔒 Data Control & Privacy</h3>
              
              <div className="data-sharing-settings">
                <h4>Data Sharing Preferences</h4>
                <div className="sharing-options">
                  {Object.entries(dataSharing).map(([key, value]) => (
                    <label key={key} className="sharing-option">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setDataSharing(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                      />
                      <span className="option-label">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="access-log">
                <h4>Recent Data Access</h4>
                <div className="log-entries">
                  {accessLog.map((entry, index) => (
                    <div key={index} className="log-entry">
                      <div className="log-time">{entry.date}</div>
                      <div className="log-provider">{entry.provider}</div>
                      <div className="log-data">{entry.dataType}</div>
                      <div className="log-purpose">{entry.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'Resources' && (
            <div className="resources-content">
              <h3>📚 Health Literacy Resources</h3>
              
              <div className="resources-grid">
                {resources.map(resource => (
                  <div key={resource.id} className="resource-card">
                    <div className="resource-icon">
                      {resource.type === 'video' ? '🎥' : resource.type === 'article' ? '📄' : '🎮'}
                    </div>
                    <h4>{resource.title}</h4>
                    <p>{resource.description}</p>
                    <div className="resource-meta">
                      <span className="resource-type">{resource.type}</span>
                      <span className="resource-duration">{resource.duration}</span>
                    </div>
                    <button 
                      className="resource-btn"
                      onClick={() => setSelectedResource(resource)}
                    >
                      Access Resource
                    </button>
                  </div>
                ))}
              </div>

              {selectedResource && (
                <div className="resource-modal">
                  <div className="modal-content">
                    <h3>{selectedResource.title}</h3>
                    <p>{selectedResource.description}</p>
                    <div className="resource-preview">
                      <p>🎥 Video content would be displayed here</p>
                      <p>📄 Article content would be displayed here</p>
                      <p>🎮 Interactive content would be displayed here</p>
                    </div>
                    <button onClick={() => setSelectedResource(null)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'FHIR Reports' && (
            <div className="fhir-reports-section">
              <h3>FHIR Reports</h3>
              {patientReports.length === 0 ? (
                <p>No FHIR reports available.</p>
              ) : (
                <ul>
                  {patientReports.map((report, idx) => (
                    <li key={idx} style={{marginBottom:12}}>
                      <div className="fhir-report-card" style={{background:'#f9f9f9',padding:12,borderRadius:8,boxShadow:'0 2px 8px #eee',maxWidth:600}}>
                        <h4>FHIR Medical Note</h4>
                        <div><strong>Date:</strong> {report.effectiveDateTime ? new Date(report.effectiveDateTime).toLocaleString() : 'Unknown'}</div>
                        <div><strong>Patient:</strong> {report.subject?.display || 'Unknown'}</div>
                        <div><strong>Medications:</strong> {extractMedications(report.valueString)}</div>
                        <div><strong>Symptoms:</strong> {extractSymptoms(report.valueString)}</div>
                        <div><strong>Summary:</strong>
                          <pre style={{whiteSpace:'pre-wrap',background:'none',padding:0}}>{extractSummary(report.valueString)}</pre>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 