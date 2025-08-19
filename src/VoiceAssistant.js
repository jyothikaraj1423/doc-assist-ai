import React, { useState, useEffect, useRef } from 'react';
import './VoiceAssistant.css';

// Add keyword lists and speaker detection
const doctorKeywords = [
  // Typical Doctor Questions
  'can you describe the pain', 'when did this start', 'have you experienced this before', 'are you taking any other medications', 'does it hurt when you move',
  // Instructional or Advisory Language
  'you need to', 'i suggest you', 'please ensure', 'try to avoid', 'make sure you',
  // Medical/Clinical Terminology
  'diagnosis', 'symptoms', 'medication', 'prescription', 'dosage', 'lab results', 'test report', 'blood pressure', 'follow-up', 'side effects', 'refer to specialist', 'imaging', 'ct', 'mri', 'x-ray', 'monitoring', 'observation', 'chronic', 'acute', 'prognosis', 'treatment plan',
  // Administrative Actions
  'let me update your chart', 'i’ll upload your prescription', 'you’ll receive the report by', 'schedule a follow-up', 'please get these tests done',
  // Patterns
  'you should', 'let me', 'i recommend', 'please', 'i will', 'i’ll', 'i am prescribing', 'i am referring', 'i am ordering', 'i am suggesting', 'i am advising', 'i am recommending', 'i am monitoring', 'i am updating', 'i am uploading', 'i am scheduling', 'i am requesting', 'i am instructing', 'i am advising', 'i am noting', 'i am documenting', 'i am charting', 'i am following up', 'i am reviewing', 'i am checking', 'i am evaluating', 'i am assessing', 'i am planning', 'i am treating', 'i am managing', 'i am observing', 'i am diagnosing', 'i am prescribing', 'i am referring', 'i am ordering', 'i am suggesting', 'i am advising', 'i am recommending', 'i am monitoring', 'i am updating', 'i am uploading', 'i am scheduling', 'i am requesting', 'i am instructing', 'i am advising', 'i am noting', 'i am documenting', 'i am charting', 'i am following up', 'i am reviewing', 'i am checking', 'i am evaluating', 'i am assessing', 'i am planning', 'i am treating', 'i am managing', 'i am observing', 'i am diagnosing'
];
const patientKeywords = [
  // Symptom Descriptions
  'i feel', 'it hurts when', 'i’ve been having', 'sometimes i get', 'it started', 'i’m not sure what’s wrong', 'i get tired easily', 'i can’t sleep', 'my sugar levels are high',
  // Seeking Clarification or Help
  'what does this mean', 'should i be worried', 'do i need to take this forever', 'can i eat that', 'is this normal', 'will this go away', 'what are the side effects',
  // Sharing Personal History
  'i had surgery before', 'my father also had this', 'i’ve been taking this medicine for', 'i stopped the medication', 'i missed a dose yesterday', 'i don’t have any allergies',
  // Patterns
  'i feel', 'i have', 'i am', 'my', 'it hurts', 'i’m experiencing', 'i noticed', 'i think', 'i would like', 'i want', 'i need', 'i don’t know', 'i can’t', 'i’ve been', 'i am', 'i was'
];
function detectSpeaker(text, currentSpeaker) {
  const lower = text.toLowerCase();
  if (patientKeywords.some(k => lower.includes(k))) return 'Patient';
  if (doctorKeywords.some(k => lower.includes(k))) return 'Doctor';
  return currentSpeaker;
}

// Medication and symptom lists
const MEDICATIONS = [
  // Antibiotics
  'amoxicillin', 'azithromycin', 'ciprofloxacin', 'doxycycline', 'cephalexin',
  // Pain Relievers
  'ibuprofen', 'acetaminophen', 'paracetamol', 'naproxen', 'aspirin',
  // Blood Pressure
  'lisinopril', 'amlodipine', 'hydrochlorothiazide', 'metoprolol', 'losartan',
  // Diabetes
  'metformin', 'insulin', 'glipizide', 'glyburide', 'sitagliptin',
  // Cholesterol
  'atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin', 'ezetimibe',
  // Antidepressants
  'sertraline', 'fluoxetine', 'escitalopram', 'citalopram', 'venlafaxine',
  // Asthma
  'albuterol', 'fluticasone', 'montelukast', 'salmeterol', 'budesonide',
  // Anticoagulants
  'warfarin', 'rivaroxaban', 'apixaban', 'dabigatran', 'edoxaban'
];
const SYMPTOMS = [
  'fever', 'chills', 'fatigue', 'headache', 'dizziness', 'muscle pain', 'nausea', 'vomiting', 'rash',
  'anxiety', 'depression', 'insomnia', 'cough', 'sore throat', 'diarrhea', 'constipation', 'weight loss', 'palpitations'
];
const EMERGENCY_ALERTS = [
  'chest pain', 'shortness of breath', 'difficulty breathing', 'severe pain', 'unconscious', 'seizure', 'stroke', 'heart attack'
];
const CRITICAL_ALERTS = [
  'high blood pressure', 'low blood pressure', 'rapid heart rate', 'irregular heartbeat', 'severe headache', 'vision changes', 'numbness', 'weakness', 'confusion'
];
const MEDICATION_ALERTS = [
  'allergy', 'side effects', 'overdose', 'wrong dosage', 'drug interaction', 'contraindication', 'duplicate prescription'
];

export default function VoiceAssistant({ userRole, selectedPatient, onReportSubmit }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [finalTranscription, setFinalTranscription] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [fhirNotes, setFhirNotes] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [currentSpeaker, setCurrentSpeaker] = useState('Doctor');
  const [transcriptSegments, setTranscriptSegments] = useState([]); // {speaker, text}
  const [detectedMedications, setDetectedMedications] = useState([]);
  const [detectedSymptoms, setDetectedSymptoms] = useState([]);
  const [reportSaved, setReportSaved] = useState(false);
  const [showFhir, setShowFhir] = useState(true); // New state for FHIR collapsible
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableSymptoms, setEditableSymptoms] = useState([]);
  const [editableMedications, setEditableMedications] = useState([]);
  const [editableNotes, setEditableNotes] = useState('');
  const [editableSummary, setEditableSummary] = useState('');

  const liveTranscriptionRef = useRef('');

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        setProcessingStatus('listening');
      };

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            const newSpeaker = detectSpeaker(transcript, currentSpeaker);
            setCurrentSpeaker(newSpeaker);
            setTranscriptSegments(prev => [...prev, { speaker: newSpeaker, text: transcript.trim() }]);
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentText = finalTranscript + interimTranscript;
        setLiveTranscription(interimTranscript); // Only interim
        liveTranscriptionRef.current = interimTranscript; // <-- keep ref up to date
        
        // Process for alerts in real-time
        processForAlerts(currentText);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          return;
        }
        setIsRecording(false);
        setProcessingStatus('error');
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        // Finalize any remaining interim transcript as a segment using the ref
        if (liveTranscriptionRef.current && liveTranscriptionRef.current.trim()) {
          setTranscriptSegments(prev => [...prev, { speaker: currentSpeaker, text: liveTranscriptionRef.current.trim() }]);
        }
        setLiveTranscription('');
        liveTranscriptionRef.current = '';
        if (isRecording && !isPaused) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  }, []);

  const processForAlerts = (text) => {
    const newAlerts = [];
    const lowerText = text.toLowerCase();

    // Emergency symptoms
    const emergencyTerms = ['sepsis', 'chest pain', 'shortness of breath', 'stroke', 'heart attack'];
    emergencyTerms.forEach(term => {
      if (lowerText.includes(term)) {
        const message = `Emergency symptom detected: ${term}`;
        // Deduplication/cooldown: Only add if not present in last 10 seconds
        const now = Date.now();
        const recent = alerts.filter(a => a.message === message && now - new Date(`1970-01-01T${a.timestamp}`).getTime() < 10000);
        if (recent.length === 0) {
          newAlerts.push({
            id: now,
            type: 'emergency',
            message,
            severity: 'critical',
            timestamp: new Date().toLocaleTimeString(),
            acknowledged: false
          });
        }
      }
    });

    // Drug interactions
    const medications = ['aspirin', 'warfarin', 'metformin', 'insulin', 'amoxicillin'];
    const detectedMeds = medications.filter(med => lowerText.includes(med));
    if (detectedMeds.length > 1) {
      newAlerts.push({
        id: Date.now(),
        type: 'interaction',
        message: `Potential drug interaction: ${detectedMeds.join(' + ')}`,
        severity: 'high',
        timestamp: new Date().toLocaleTimeString(),
        acknowledged: false
      });
    }

    // Dose conflicts
    if (lowerText.includes('dose') && lowerText.includes('conflict')) {
      newAlerts.push({
        id: Date.now(),
        type: 'dose',
        message: 'Dose conflict detected - review medication dosage',
        severity: 'high',
        timestamp: new Date().toLocaleTimeString(),
        acknowledged: false
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
    }
  };

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      setIsPaused(false);
      setFinalTranscription('');
      setLiveTranscription('');
      setTranscriptSegments([]);
      setCurrentSpeaker('Doctor');
      setAlerts([]);
      setFhirNotes(null);
      setProcessingStatus('listening');
      recognition.start();
    } else {
      alert('Speech recognition not available');
    }
  };

  const pauseRecording = () => {
    if (recognition) {
      setIsPaused(true);
      recognition.stop();
      setProcessingStatus('paused');
    }
  };

  const resumeRecording = () => {
    if (recognition) {
      setIsPaused(false);
      setProcessingStatus('listening');
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition) {
      // Finalize any remaining interim transcript as a segment
      if (liveTranscription && liveTranscription.trim()) {
        setTranscriptSegments(prev => [...prev, { speaker: currentSpeaker, text: liveTranscription.trim() }]);
        setLiveTranscription('');
      }
      setIsRecording(false);
      setIsPaused(false);
      recognition.stop();
      setFinalTranscription('');
      setProcessingStatus('processing');
      setTimeout(() => {
        generateFHIRNotes(transcriptSegments.map(seg => `${seg.speaker}: ${seg.text}`).join('\n'));
        setProcessingStatus('completed');
      }, 2000);
    }
  };

  const generateFHIRNotes = (transcription) => {
    // Use selectedPatient if available
    const patientDisplay = selectedPatient
      ? `${selectedPatient.name}, Age ${selectedPatient.age}${selectedPatient.condition ? ', ' + selectedPatient.condition : ''}`
      : 'Unknown Patient';
    
    // Generate summary
    let summary = `${selectedPatient?.name || 'The patient'} is currently experiencing`;
    if (detectedSymptoms.length > 0) {
      summary += ` symptoms such as ${detectedSymptoms.join(', ')}`;
    }
    if (detectedMedications.length > 0) {
      summary += detectedSymptoms.length > 0 ? ', and is taking ' : ' and is taking ';
      summary += `${detectedMedications.join(', ')}`;
    }
    if (alerts && alerts.length > 0) {
      const critical = alerts.filter(a => a.severity === 'critical');
      if (critical.length > 0) {
        summary += `. Important alerts were detected: ${critical.map(a => a.message).join('; ')}`;
      }
    }
    summary += '.';
    
    // Generate notes
    let notes = '';
    if (detectedMedications.length > 0) {
      notes += `Medications prescribed or discussed: ${detectedMedications.join(', ')}.`;
    }
    // Extract test names from transcriptSegments
    const testKeywords = ['test', 'screening', 'scan', 'profile', 'panel', 'x-ray', 'mri', 'ct', 'ultrasound', 'cbc', 'blood', 'urine', 'ecg', 'echo', 'a1c', 'hba1c'];
    const mentionedTests = transcriptSegments
      .map(seg => seg.text)
      .filter(text => testKeywords.some(keyword => text.toLowerCase().includes(keyword)));
    if (mentionedTests.length > 0) {
      notes += (notes ? '\n' : '') + 'Tests or investigations mentioned: ' + mentionedTests.join('; ');
    }
    if (!notes) notes = 'No medications or tests mentioned.';
    
    const fhirNote = {
      resourceType: "Observation",
      id: "voice-note-" + Date.now(),
      status: "final",
      category: [{
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "clinical-note",
          display: "Clinical Note"
        }]
      }],
      code: {
        coding: [{
          system: "http://loinc.org",
          code: "11506-3",
          display: "Progress note"
        }]
      },
      subject: {
        reference: selectedPatient ? `Patient/${selectedPatient.id}` : "Patient/example",
        display: patientDisplay
      },
      effectiveDateTime: new Date().toISOString(),
      valueString: `Medications: ${detectedMedications.join(', ') || 'None'}\nSymptoms: ${detectedSymptoms.join(', ') || 'None'}\nConversation:\n${transcriptSegments.map(seg => `${seg.speaker}: ${seg.text}`).join('\n')}`,
      note: [{
        text: "AI-generated note from voice transcription"
      }]
    };
    setFhirNotes(fhirNote);
    
    // Initialize editable fields
    setEditableSymptoms([...detectedSymptoms]);
    setEditableMedications([...detectedMedications]);
    setEditableNotes(notes);
    setEditableSummary(summary);
    
    // Add to session history
    const sessionEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      transcription: transcription,
      fhirNote: fhirNote,
      alerts: alerts
    };
    setSessionHistory(prev => [sessionEntry, ...prev]);

    // Save report for patient
    if (onReportSubmit && selectedPatient) {
      onReportSubmit({ ...fhirNote, createdAt: new Date().toISOString() });
      setReportSaved(true);
      setTimeout(() => setReportSaved(false), 3000);
    }
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const overrideAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Helper to add unique items
  function addUnique(list, items) {
    return Array.from(new Set([...list, ...items]));
  }

  // Edit functions
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const saveEdits = () => {
    // Update the detected arrays with edited values
    setDetectedSymptoms([...editableSymptoms]);
    setDetectedMedications([...editableMedications]);
    
    // Update FHIR notes with edited content
    if (fhirNotes) {
      const updatedFhirNotes = {
        ...fhirNotes,
        valueString: `Medications: ${editableMedications.join(', ') || 'None'}\nSymptoms: ${editableSymptoms.join(', ') || 'None'}\nConversation:\n${transcriptSegments.map(seg => `${seg.speaker}: ${seg.text}`).join('\n')}\n\nEdited Notes: ${editableNotes}\nEdited Summary: ${editableSummary}`,
        note: [{
          text: "AI-generated note from voice transcription (edited by doctor)"
        }]
      };
      setFhirNotes(updatedFhirNotes);
    }
    
    setIsEditMode(false);
    setReportSaved(true);
    setTimeout(() => setReportSaved(false), 3000);
  };

  const cancelEdits = () => {
    // Reset editable fields to original values
    setEditableSymptoms([...detectedSymptoms]);
    setEditableMedications([...detectedMedications]);
    setIsEditMode(false);
  };

  const addSymptom = () => {
    const newSymptom = prompt('Enter new symptom:');
    if (newSymptom && newSymptom.trim()) {
      setEditableSymptoms([...editableSymptoms, newSymptom.trim()]);
    }
  };

  const removeSymptom = (index) => {
    setEditableSymptoms(editableSymptoms.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    const newMedication = prompt('Enter new medication:');
    if (newMedication && newMedication.trim()) {
      setEditableMedications([...editableMedications, newMedication.trim()]);
    }
  };

  const removeMedication = (index) => {
    setEditableMedications(editableMedications.filter((_, i) => i !== index));
  };

  // Update detection and alerts on finalized segment
  useEffect(() => {
    if (transcriptSegments.length === 0) return;
    const lastSegment = transcriptSegments[transcriptSegments.length - 1];
    const text = lastSegment.text.toLowerCase();
    // Medications
    const meds = MEDICATIONS.filter(med => text.includes(med));
    if (meds.length > 0) setDetectedMedications(prev => addUnique(prev, meds));
    // Symptoms
    const syms = SYMPTOMS.filter(sym => text.includes(sym));
    if (syms.length > 0) setDetectedSymptoms(prev => addUnique(prev, syms));
    // Alerts
    const newAlerts = [];
    EMERGENCY_ALERTS.forEach(term => {
      if (text.includes(term)) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'emergency',
          message: `Emergency: ${term}`,
          severity: 'critical',
          timestamp: new Date().toLocaleTimeString(),
          acknowledged: false
        });
      }
    });
    CRITICAL_ALERTS.forEach(term => {
      if (text.includes(term)) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'critical',
          message: `Critical: ${term}`,
          severity: 'high',
          timestamp: new Date().toLocaleTimeString(),
          acknowledged: false
        });
      }
    });
    MEDICATION_ALERTS.forEach(term => {
      if (text.includes(term)) {
        newAlerts.push({
          id: Date.now() + Math.random(),
          type: 'medication',
          message: `Medication Alert: ${term}`,
          severity: 'warning',
          timestamp: new Date().toLocaleTimeString(),
          acknowledged: false
        });
      }
    });
    // Drug interaction alert (if >1 med in same segment)
    if (meds.length > 1) {
      newAlerts.push({
        id: Date.now() + Math.random(),
        type: 'interaction',
        message: `Potential drug interaction: ${meds.join(' + ')}`,
        severity: 'high',
        timestamp: new Date().toLocaleTimeString(),
        acknowledged: false
      });
    }
    if (newAlerts.length > 0) setAlerts(prev => [...prev, ...newAlerts]);
  }, [transcriptSegments]);

  return (
    <div className="voice-assistant-container">
      {/* Patient Info Card */}
      {selectedPatient && (
        <div className="patient-info-card attractive">
          <div className="patient-accent-bar"></div>
          <div className="patient-info-main">
            <div className="patient-avatar">
              {selectedPatient.avatarUrl ? (
                <img src={selectedPatient.avatarUrl} alt="avatar" />
              ) : (
                <span className="avatar-initials">
                  {selectedPatient.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="patient-details">
              <div className="patient-name-row">
                <h2 className="patient-name">{selectedPatient.name}</h2>
                <span className="patient-id">#{selectedPatient.id || 'N/A'}</span>
              </div>
              <div className="patient-info-grid">
                <div className="info-item"><span className="info-icon" role="img" aria-label="age">🎂</span> <strong>Age:</strong> {selectedPatient.age}</div>
                <div className="info-item"><span className="info-icon" role="img" aria-label="gender">🚻</span> <strong>Gender:</strong> {selectedPatient.gender}</div>
                <div className="info-item"><span className="info-icon" role="img" aria-label="contact">📞</span> <strong>Contact:</strong> {selectedPatient.contact}</div>
                <div className="info-item"><span className="info-icon" role="img" aria-label="reason">🩺</span> <strong>Reason:</strong> {selectedPatient.reason}</div>
                <div className="info-item"><span className="info-icon" role="img" aria-label="symptoms">🤒</span> <strong>Symptoms:</strong> {selectedPatient.symptoms}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {reportSaved && (
        <div style={{background:'#d4edda',color:'#155724',padding:'8px 16px',borderRadius:6,marginBottom:12}}>
          ✅ Report saved to patient record!
        </div>
      )}
      <div className="voice-assistant-content">
        {/* Header */}
        <div className="voice-header">
          <h2>🎤 Voice Assistant</h2>
          <p>AI-powered voice transcription with real-time alerts and FHIR integration</p>
        </div>

        {/* Recording Controls */}
        <div className="recording-controls">
          <div className="control-buttons">
            {!isRecording ? (
              <button className="control-btn start" onClick={startRecording}>
                🎤 Start Recording
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button className="control-btn pause" onClick={pauseRecording}>
                    ⏸️ Pause
                  </button>
                ) : (
                  <button className="control-btn resume" onClick={resumeRecording}>
                    ▶️ Resume
                  </button>
                )}
                <button className="control-btn stop" onClick={stopRecording}>
                  ⏹️ Stop & Process
                </button>
              </>
            )}
          </div>
          
          <div className="status-indicator">
            <div className={`status-dot ${processingStatus}`}></div>
            <span className="status-text">
              {processingStatus === 'idle' && 'Ready to record'}
              {processingStatus === 'listening' && 'Listening...'}
              {processingStatus === 'paused' && 'Paused'}
              {processingStatus === 'processing' && 'Processing with AI...'}
              {processingStatus === 'completed' && 'Completed'}
              {processingStatus === 'error' && 'Error occurred'}
            </span>
          </div>
        </div>

        {/* Live Transcription */}
        <div className="transcription-section">
          <h3>Live Transcription</h3>
          <div className="transcription-display">
            <div className="live-transcription transcript-segments" style={{maxHeight: '200px', overflowY: 'auto', background: '#f9f9f9', padding: '8px', borderRadius: '6px', border: '1px solid #eee'}}>
              {transcriptSegments.length === 0 && !isRecording && (
                <span>Transcription will appear here...</span>
              )}
              {transcriptSegments.map((seg, idx) => (
                <div key={idx} className={`segment ${seg.speaker.toLowerCase()}`}> 
                  <strong>{seg.speaker}:</strong> {seg.text}
                </div>
              ))}
              {isRecording && liveTranscription && (
                <div className="segment interim">
                  <strong>{currentSpeaker}:</strong> {liveTranscription}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detected Medications */}
        <div className="detected-card">
          <div className="detected-card-header">
            <span className="detected-icon" role="img" aria-label="medication">💊</span>
            <span className="detected-title">Detected Medications</span>
          </div>
          <div className="detected-card-content">
            {detectedMedications.length > 0 ? (
              <ul>
                {detectedMedications.map((med, idx) => <li key={idx}>{med}</li>)}
              </ul>
            ) : <span className="detected-empty">No medications detected.</span>}
          </div>
        </div>

        {/* Detected Symptoms */}
        <div className="detected-card">
          <div className="detected-card-header">
            <span className="detected-icon" role="img" aria-label="symptom">🤒</span>
            <span className="detected-title">Detected Symptoms</span>
          </div>
          <div className="detected-card-content">
            {detectedSymptoms.length > 0 ? (
              <ul>
                {detectedSymptoms.map((sym, idx) => <li key={idx}>{sym}</li>)}
              </ul>
            ) : <span className="detected-empty">No symptoms detected.</span>}
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="alerts-section">
            <h3>⚠️ Real-time Alerts</h3>
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''}`}>
                  <div className="alert-content">
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-meta">
                      <span className="alert-time">{alert.timestamp}</span>
                      <span className="alert-type">{alert.type}</span>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <div className="alert-actions">
                      <button 
                        className="alert-btn acknowledge"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        ✓ Acknowledge
                      </button>
                      <button 
                        className="alert-btn override"
                        onClick={() => overrideAlert(alert.id)}
                      >
                        ✗ Override
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        <div className="detected-card">
          <div className="detected-card-header">
            <span className="detected-icon" role="img" aria-label="alert">🚨</span>
            <span className="detected-title">Alerts</span>
          </div>
          <div className="detected-card-content">
            {alerts.length > 0 ? (
              <ul>
                {alerts.map(alert => (
                  <li key={alert.id} style={{color: alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'goldenrod'}}>
                    <strong>[{alert.type.toUpperCase()}]</strong> {alert.message} <span style={{fontSize: '0.8em', color: '#888'}}>({alert.timestamp})</span>
                  </li>
                ))}
              </ul>
            ) : <span className="detected-empty">No alerts.</span>}
          </div>
        </div>

        {/* FHIR Notes */}
        {/* Removed FHIR Medical Notes JSON section as per user request */}

        {/* Human-Readable FHIR Medical Report */}
        {fhirNotes && (
          <div className="fhir-human-report" style={{background:'#fff',borderRadius:12,padding:24,marginTop:24,boxShadow:'0 2px 8px #eee'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <h2>Medical Report</h2>
              {userRole === 'doctor' && (
                <div style={{display:'flex',gap:8}}>
                  {!isEditMode ? (
                    <button 
                      onClick={toggleEditMode}
                      className="edit-btn edit"
                    >
                      ✏️ Edit Report
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={saveEdits}
                        className="edit-btn save"
                      >
                        💾 Save Changes
                      </button>
                      <button 
                        onClick={cancelEdits}
                        className="edit-btn cancel"
                      >
                        ❌ Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <h3>1. Patient Information</h3>
            <p><strong>Name:</strong> {selectedPatient?.name || 'N/A'}</p>
            <p><strong>Patient ID:</strong> {selectedPatient?.id || 'N/A'}</p>
            <p><strong>Age:</strong> {selectedPatient?.age || 'N/A'}</p>
            <p><strong>Gender:</strong> {selectedPatient?.gender || 'N/A'}</p>
            <p><strong>Contact:</strong> {selectedPatient?.contact || selectedPatient?.email || 'N/A'}</p>
            <p><strong>Reason for Visit:</strong> {selectedPatient?.reason || 'N/A'}</p>
            
            <h3>2. Visit Details</h3>
            <p><strong>Date & Time:</strong> {fhirNotes.effectiveDateTime ? new Date(fhirNotes.effectiveDateTime).toLocaleString() : new Date().toLocaleString()}</p>
            <p><strong>Consultation Type:</strong> Teleconsultation</p>
            
            <h3>3. Symptoms</h3>
            {isEditMode ? (
              <div>
                <ul className="editable-list">
                  {editableSymptoms.map((sym, i) => (
                    <li key={i}>
                      <span>{sym}</span>
                      <button 
                        onClick={() => removeSymptom(i)}
                        className="edit-btn remove"
                      >
                        ✗
                      </button>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={addSymptom}
                  className="edit-btn add"
                >
                  ➕ Add Symptom
                </button>
              </div>
            ) : (
              <ul>
                {(detectedSymptoms && detectedSymptoms.length > 0) ? detectedSymptoms.map((sym, i) => (
                  <li key={i}>{sym}</li>
                )) : <li>None reported</li>}
              </ul>
            )}
            
            <h3>4. Medications</h3>
            {isEditMode ? (
              <div>
                <ul className="editable-list">
                  {editableMedications.map((med, i) => (
                    <li key={i}>
                      <span>{med}</span>
                      <button 
                        onClick={() => removeMedication(i)}
                        className="edit-btn remove"
                      >
                        ✗
                      </button>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={addMedication}
                  className="edit-btn add"
                >
                  ➕ Add Medication
                </button>
              </div>
            ) : (
              <ul>
                {(detectedMedications && detectedMedications.length > 0) ? detectedMedications.map((med, i) => (
                  <li key={i}>{med}</li>
                )) : <li>None reported</li>}
              </ul>
            )}
            
            {/* AI-Generated Summary Section */}
            <h3>5. Summary of Condition</h3>
            {isEditMode ? (
              <textarea
                value={editableSummary}
                onChange={(e) => setEditableSummary(e.target.value)}
                className="edit-textarea"
                placeholder="Edit the summary of the patient's condition..."
              />
            ) : (
              <div style={{background:'#f6f8fa',borderRadius:8,padding:12,marginBottom:8}}>
                {(() => {
                  if (detectedSymptoms.length === 0 && detectedMedications.length === 0 && (!alerts || alerts.length === 0)) {
                    return 'No significant symptoms or medications reported during this session.';
                  }
                  let summary = `${selectedPatient?.name || 'The patient'} is currently experiencing`;
                  if (detectedSymptoms.length > 0) {
                    summary += ` symptoms such as ${detectedSymptoms.join(', ')}`;
                  }
                  if (detectedMedications.length > 0) {
                    summary += detectedSymptoms.length > 0 ? ', and is taking ' : ' and is taking ';
                    summary += `${detectedMedications.join(', ')}`;
                  }
                  if (alerts && alerts.length > 0) {
                    const critical = alerts.filter(a => a.severity === 'critical');
                    if (critical.length > 0) {
                      summary += `. Important alerts were detected: ${critical.map(a => a.message).join('; ')}`;
                    }
                  }
                  summary += '.';
                  return summary;
                })()}
              </div>
            )}
            
            <h3>6. Alerts</h3>
            <ul>
              {alerts && alerts.length > 0 ? alerts.map((alert, i) => (
                <li key={i} style={{color: alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'goldenrod'}}>
                  <strong>[{alert.type.toUpperCase()}]</strong> {alert.message}
                </li>
              )) : <li>No alerts during session.</li>}
            </ul>
            
            <h3>7. Doctor's Notes</h3>
            {isEditMode ? (
              <textarea
                value={editableNotes}
                onChange={(e) => setEditableNotes(e.target.value)}
                className="edit-textarea notes"
                placeholder="Edit the doctor's notes..."
              />
            ) : (
              <div style={{whiteSpace:'pre-line',background:'#f6f8fa',borderRadius:8,padding:12}}>
                {(() => {
                  let notes = '';
                  if (detectedMedications.length > 0) {
                    notes += `Medications prescribed or discussed: ${detectedMedications.join(', ')}.`;
                  }
                  // Extract test names from transcriptSegments
                  const testKeywords = ['test', 'screening', 'scan', 'profile', 'panel', 'x-ray', 'mri', 'ct', 'ultrasound', 'cbc', 'blood', 'urine', 'ecg', 'echo', 'a1c', 'hba1c'];
                  const mentionedTests = transcriptSegments
                    .map(seg => seg.text)
                    .filter(text => testKeywords.some(keyword => text.toLowerCase().includes(keyword)));
                  if (mentionedTests.length > 0) {
                    notes += (notes ? '\n' : '') + 'Tests or investigations mentioned: ' + mentionedTests.join('; ');
                  }
                  if (!notes) notes = 'No medications or tests mentioned.';
                  return notes;
                })()}
              </div>
            )}
          </div>
        )}

        {/* Session History */}
        {sessionHistory.length > 0 && (
          <div className="history-section">
            <h3>📚 Session History</h3>
            <div className="history-list">
              {sessionHistory.map(session => (
                <div key={session.id} className="history-item">
                  <div className="history-header">
                    <span className="history-time">{session.timestamp}</span>
                    <span className="history-alerts">
                      {session.alerts.length} alerts
                    </span>
                  </div>
                  <div className="history-transcription">
                    {session.transcription.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Submit Report Button for Doctor */}
      {userRole === 'doctor' && (
        <div style={{marginTop: 24, textAlign: 'center'}}>
          <button
            onClick={() => {
              const report = {
                date: new Date().toISOString().split('T')[0],
                symptoms: detectedSymptoms,
                medications: detectedMedications,
                alerts: alerts,
                notes: fhirNotes?.valueString || '',
              };
              onReportSubmit && onReportSubmit(report);
              alert('Report submitted and saved to patient record!');
            }}
            style={{background: '#3182ce', color: '#fff', padding: '10px 20px', borderRadius: 6, border: 'none', fontSize: '1.1em'}}
          >
            Submit Report
          </button>
        </div>
      )}
    </div>
  );
} 