import React, { useState, useEffect } from 'react';
import './Messages.css';

export default function Messages({ userRole, username, patients = [] }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const doctorName = `Dr. ${username}`;

  // Debug logging
  console.log('Messages Component Debug:', {
    doctorName,
    username,
    patientsCount: patients.length,
    messagesCount: messages.length,
    selectedPatient: selectedPatient?.name
  });

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('docassist_messages');
    console.log('Loading messages from localStorage:', savedMessages);
    
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      console.log('Parsed messages:', parsedMessages);
      setMessages(parsedMessages);
    } else {
      // Initialize with sample messages for existing patients
      const sampleMessages = [
        // Messages for John Doe
        { 
          id: 1, 
          from: doctorName, 
          to: 'John Doe', 
          content: 'Hello John! Your lab results are ready. Please schedule a follow-up appointment.', 
          timestamp: '2024-01-15 10:30', 
          read: false,
          senderRole: 'doctor'
        },
        { 
          id: 2, 
          from: 'John Doe', 
          to: doctorName, 
          content: 'Thank you, doctor. I have a question about my medication dosage.', 
          timestamp: '2024-01-15 14:20', 
          read: true,
          senderRole: 'patient'
        },
        { 
          id: 3, 
          from: doctorName, 
          to: 'John Doe', 
          content: 'Of course! What medication are you referring to? I can help adjust the dosage if needed.', 
          timestamp: '2024-01-15 15:45', 
          read: false,
          senderRole: 'doctor'
        },
        // Messages for Sarah Johnson
        { 
          id: 4, 
          from: doctorName, 
          to: 'Sarah Johnson', 
          content: 'Hi Sarah, your blood pressure readings look good. Keep monitoring as discussed.', 
          timestamp: '2024-01-16 09:15', 
          read: false,
          senderRole: 'doctor'
        },
        // Messages for Michael Chen
        { 
          id: 5, 
          from: 'Michael Chen', 
          to: doctorName, 
          content: 'Hello doctor, I have some questions about my annual physical results.', 
          timestamp: '2024-01-16 11:30', 
          read: false,
          senderRole: 'patient'
        }
      ];
      console.log('Setting sample messages:', sampleMessages);
      setMessages(sampleMessages);
      localStorage.setItem('docassist_messages', JSON.stringify(sampleMessages));
    }
  }, [doctorName]);

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    // Only set up interval if user is logged in and component is mounted
    if (!userRole || userRole !== 'doctor') {
      return;
    }
    
    const interval = setInterval(() => {
      const savedMessages = localStorage.getItem('docassist_messages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Only update if messages have changed
        if (JSON.stringify(parsedMessages) !== JSON.stringify(messages)) {
          console.log('Auto-refresh: New messages detected, updating...');
          setMessages(parsedMessages);
        }
      }
    }, 3000);

    return () => {
      console.log('Cleaning up Messages auto-refresh interval');
      clearInterval(interval);
    };
  }, [messages, userRole]);

  // Auto-refresh when selected patient changes
  useEffect(() => {
    if (selectedPatient && userRole === 'doctor') {
      const savedMessages = localStorage.getItem('docassist_messages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        console.log('Patient changed, refreshing messages:', parsedMessages);
        setMessages(parsedMessages);
      }
    }
  }, [selectedPatient, userRole]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    console.log('Saving messages to localStorage:', messages);
    localStorage.setItem('docassist_messages', JSON.stringify(messages));
  }, [messages]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get messages for selected patient
  const patientMessages = messages.filter(msg => 
    (msg.from === selectedPatient?.name && msg.to === doctorName) ||
    (msg.from === doctorName && msg.to === selectedPatient?.name)
  );

  console.log('Patient messages for', selectedPatient?.name, ':', patientMessages);

  // Send message function
  const sendMessage = () => {
    if (newMessage.trim() && selectedPatient) {
      const message = {
        id: Date.now(),
        from: doctorName,
        to: selectedPatient.name,
        content: newMessage.trim(),
        timestamp: new Date().toLocaleString(),
        read: false,
        senderRole: 'doctor'
      };
      console.log('Sending message:', message);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  // Refresh messages function
  const refreshMessages = () => {
    const savedMessages = localStorage.getItem('docassist_messages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      console.log('Refreshing messages:', parsedMessages);
      setMessages(parsedMessages);
    }
  };

  // Clear all messages function
  const clearAllMessages = () => {
    localStorage.removeItem('docassist_messages');
    setMessages([]);
    console.log('Cleared all messages from localStorage');
  };

  // Debug function to show all messages
  const debugAllMessages = () => {
    const savedMessages = localStorage.getItem('docassist_messages');
    console.log('=== ALL MESSAGES IN LOCALSTORAGE ===');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      parsedMessages.forEach((msg, index) => {
        console.log(`Message ${index + 1}:`, {
          from: msg.from,
          to: msg.to,
          content: msg.content.substring(0, 50) + '...',
          timestamp: msg.timestamp
        });
      });
    } else {
      console.log('No messages in localStorage');
    }
    console.log('=== END ALL MESSAGES ===');
  };

  // Mark messages as read
  const markAsRead = (patientName) => {
    setMessages(prev => prev.map(msg => 
      (msg.from === patientName && msg.to === doctorName) 
        ? { ...msg, read: true }
        : msg
    ));
  };

  // Get unread count for a patient
  const getUnreadCount = (patientName) => {
    return messages.filter(msg => 
      msg.from === patientName && 
      msg.to === doctorName && 
      !msg.read
    ).length;
  };

  // Get last message for a patient
  const getLastMessage = (patientName) => {
    const patientMsgs = messages.filter(msg => 
      (msg.from === patientName && msg.to === doctorName) ||
      (msg.from === doctorName && msg.to === patientName)
    );
    return patientMsgs[patientMsgs.length - 1];
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    console.log('Selecting patient:', patient);
    setSelectedPatient(patient);
    markAsRead(patient.name);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (userRole !== 'doctor') {
    return (
      <div className="messages-container">
        <div className="messages-content">
          <h2>Messages</h2>
          <p>Only doctors can access this feature.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <div className="messages-header">
          <h3>💬 Patient Messages</h3>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
            <button 
              onClick={refreshMessages}
              style={{
                padding: '8px 12px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              🔄 Refresh
            </button>
            <button 
              onClick={debugAllMessages}
              style={{
                padding: '8px 12px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              🔍 Debug
            </button>
            <button 
              onClick={clearAllMessages}
              style={{
                padding: '8px 12px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              🗑️ Clear
            </button>
          </div>
        </div>
        
        <div className="patients-list">
          {filteredPatients.length === 0 ? (
            <div className="no-patients">
              <p>No patients found</p>
            </div>
          ) : (
            filteredPatients.map(patient => {
              const lastMessage = getLastMessage(patient.name);
              const unreadCount = getUnreadCount(patient.name);
              
              console.log('Patient', patient.name, 'has', unreadCount, 'unread messages');
              
              return (
                <div
                  key={patient.id}
                  className={`patient-item ${selectedPatient?.id === patient.id ? 'active' : ''}`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="patient-avatar">
                    <span className="avatar-initials">
                      {patient.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                    </span>
                    {unreadCount > 0 && (
                      <span className="unread-badge">{unreadCount}</span>
                    )}
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name}</h4>
                    <p className="last-message">
                      {lastMessage ? lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '') : 'No messages yet'}
                    </p>
                    {lastMessage && (
                      <span className="message-time">{lastMessage.timestamp}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="messages-main">
        {selectedPatient ? (
          <>
            <div className="conversation-header">
              <div className="patient-details">
                <span className="patient-avatar">
                  {selectedPatient.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                </span>
                <div>
                  <h3>{selectedPatient.name}</h3>
                  <p>{selectedPatient.email || selectedPatient.contact}</p>
                </div>
              </div>
              <div className="patient-status">
                <span className="status-dot online"></span>
                <span>Online</span>
              </div>
            </div>

            <div className="conversation-messages">
              {patientMessages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                patientMessages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.from === doctorName ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="message-compose">
              <textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="3"
              />
              <button 
                onClick={sendMessage} 
                disabled={!newMessage.trim()}
                className="send-button"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="no-selection">
            <div className="no-selection-content">
              <h3>Select a patient to start messaging</h3>
              <p>Choose a patient from the list to view and respond to their messages.</p>
              <div style={{marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                <h4>Debug Info:</h4>
                <p>Doctor Name: {doctorName}</p>
                <p>Total Messages: {messages.length}</p>
                <p>Patients: {patients.map(p => p.name).join(', ')}</p>
                <p>Selected Patient: {selectedPatient?.name || 'None'}</p>
                <p>Patient Messages Count: {patientMessages.length}</p>
                <button 
                  onClick={debugAllMessages}
                  style={{
                    marginTop: '10px',
                    padding: '6px 12px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Show All Messages in Console
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 