import React, { useState, useEffect } from 'react';
import './Conversations.css';

const mockPatients = [
  { id: 1, name: 'John Smith', status: 'online', lastMessage: 'I have been feeling better since the medication change.' },
  { id: 2, name: 'Sarah Johnson', status: 'offline', lastMessage: 'When should I schedule my next appointment?' },
  { id: 3, name: 'Mike Davis', status: 'online', lastMessage: 'The symptoms have improved significantly.' },
];

const doctorKeywords = [
  'how are you', 'tell me about', 'describe', 'do you have', 'are you experiencing',
  'let me check', 'when did', 'have you noticed', 'any pain', "let's discuss",
  'can you show', 'please explain', 'what brings you', 'how long have you', "let's review"
];
const patientKeywords = [
  'i feel', 'i have', 'my', 'it hurts', 
  "i'm experiencing", 'i noticed', 'i think', 'i would like', 'i want', 'i need',
  "i don't know", "i can't", "i've been", 'i am', 'i was'
];

function detectSpeaker(text, currentSpeaker) {
  const lower = text.toLowerCase();
  // If patient keywords found, switch to patient
  if (patientKeywords.some(k => lower.includes(k))) return 'Patient';
  // If doctor keywords found, switch to doctor
  if (doctorKeywords.some(k => lower.includes(k))) return 'Doctor';
  // Otherwise, keep current
  return currentSpeaker;
}

export default function Conversations() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [finalTranscription, setFinalTranscription] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState('Doctor');
  const [transcriptSegments, setTranscriptSegments] = useState([]);

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

        setLiveTranscription(interimTranscript); // Only interim
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // No speech detected, keep recording
          return;
        }
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        // Finalize any remaining interim transcript as a segment
        setTranscriptSegments(prev => {
          if (liveTranscription && liveTranscription.trim()) {
            return [...prev, { speaker: currentSpeaker, text: liveTranscription.trim() }];
          }
          return prev;
        });
        setLiveTranscription('');
        if (isRecording) {
          // Restart if still recording
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  }, [isRecording]);

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      setFinalTranscription('');
      setLiveTranscription('');
      setTranscriptSegments([]); // Clear previous transcript
      setCurrentSpeaker('Doctor'); // Always start with Doctor
      recognition.start();
    } else {
      alert('Speech recognition not available');
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
      recognition.stop();
    }
  };

  const submitTranscription = () => {
    if (finalTranscription.trim() || transcriptSegments.length > 0) {
      setSubmittedMessage(finalTranscription || transcriptSegments.map(seg => `${seg.speaker}: ${seg.text}`).join('\n'));
      setFinalTranscription('');
      setLiveTranscription('');
      setTranscriptSegments([]);
      setCurrentSpeaker('Doctor');
      console.log('Transcription submitted:', finalTranscription || transcriptSegments);
      
      // Clear submitted message after 3 seconds
      setTimeout(() => {
        setSubmittedMessage('');
      }, 3000);
    }
  };

  return (
    <div className="conversations-container">
      <div className="conversations-sidebar">
        <div className="conversations-header">
          <h3>Patients</h3>
          <button className="new-chat-btn">+ New Chat</button>
        </div>
        <div className="patients-list">
          {mockPatients.map(patient => (
            <div
              key={patient.id}
              className={`patient-item ${selectedPatient?.id === patient.id ? 'active' : ''}`}
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="patient-avatar">
                <div className={`status-indicator ${patient.status}`}></div>
              </div>
              <div className="patient-info">
                <h4>{patient.name}</h4>
                <p>{patient.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="conversation-main">
        {selectedPatient ? (
          <>
            <div className="conversation-header">
              <div className="patient-details">
                <h3>{selectedPatient.name}</h3>
                <span className={`status ${selectedPatient.status}`}>
                  {selectedPatient.status}
                </span>
              </div>
            </div>

            {/* Transcription Box */}
            <div className="transcription-box">
              <h4>Voice Transcription</h4>
              {submittedMessage && (
                <div className="submission-confirmation">
                  ✅ Submitted: "{submittedMessage}"
                </div>
              )}
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
              <div className="transcription-controls">
                {!isRecording ? (
                  <button 
                    className="record-btn start"
                    onClick={startRecording}
                  >
                    🎤 Start Recording
                  </button>
                ) : (
                  <button 
                    className="record-btn stop"
                    onClick={stopRecording}
                  >
                    ⏹️ Stop Recording
                  </button>
                )}
                {(finalTranscription || transcriptSegments.length > 0) && !isRecording && (
                  <button 
                    className="submit-btn"
                    onClick={submitTranscription}
                  >
                    📤 Submit
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="no-conversation">
            <h3>Select a patient to start transcription</h3>
            <p>Choose from the list on the left to begin voice transcription</p>
          </div>
        )}
      </div>
    </div>
  );
} 