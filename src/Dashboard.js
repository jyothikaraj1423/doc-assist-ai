import React from 'react';
import './Dashboard.css';

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

export default function Dashboard({ userRole, patientInfo, patients = [], patientReports = {}, onStartConsultation, selectedPatient, setCurrentView, username }) {
  const isDoctor = userRole === 'doctor';

  // Handler for stats/quick actions
  const handleCardClick = (view) => setCurrentView && setCurrentView(view);

  // Appointments: patients with status 'pending' only
  const activePatients = patients.filter(
    p => p.status === 'pending'
  );

  // New Appointments: status 'pending' and no reports
  const newAppointments = patients.filter(
    p => p.status === 'pending' && (!patientReports[p.id] || patientReports[p.id].length === 0)
  );
  // Already Visited (Active Patients): status 'active' or at least one report
  const alreadyVisited = patients.filter(
    p => p.status === 'active' || (patientReports[p.id] && patientReports[p.id].length > 0)
  );

  // Filter state for appointments stat card
  const [appointmentsFilter, setAppointmentsFilter] = React.useState('all');
  // Value and label for the stat card based on filter
  let appointmentsValue = activePatients.length;
  let appointmentsLabel = 'Appointments';
  if (appointmentsFilter === 'new') {
    appointmentsValue = newAppointments.length;
    appointmentsLabel = 'New Appointments';
  } else if (appointmentsFilter === 'visited') {
    appointmentsValue = alreadyVisited.length;
    appointmentsLabel = 'Active Patients';
  }

  const patientStats = [
    { label: 'Recent Visits', value: 5, color: '#3182ce', icon: '🏥' },
    { label: 'Active Medications', value: 3, color: '#38a169', icon: '💊' },
    { label: 'Upcoming Appointments', value: 2, color: '#d69e2e', icon: '📅' },
    { label: 'Data Access Requests', value: 1, color: '#e53e3e', icon: '🔐' },
  ];

  const doctorStats = [
    { label: appointmentsLabel, value: appointmentsValue, color: '#3182ce', icon: '👥' },
    { label: 'Pending Alerts', value: 3, color: '#e53e3e', icon: '⚠️' },
    { label: "Today's Orders", value: 12, color: '#38a169', icon: '📋' },
    { label: 'Voice Sessions', value: 8, color: '#d69e2e', icon: '🎤' },
  ];

  const stats = isDoctor ? doctorStats : patientStats;

  const recentActivities = isDoctor ? [
    { type: 'alert', message: 'Drug interaction detected: Aspirin + Warfarin', time: '2 min ago', severity: 'high' },
    { type: 'order', message: 'Ordered CBC for Patient John Smith', time: '15 min ago', severity: 'normal' },
    { type: 'voice', message: 'Voice note transcribed: "Patient reports chest pain"', time: '1 hour ago', severity: 'normal' },
    { type: 'alert', message: 'Emergency symptom detected: Sepsis', time: '2 hours ago', severity: 'critical' },
  ] : [
    { type: 'data', message: 'Dr. Johnson accessed your medical records', time: '1 hour ago', severity: 'normal' },
    { type: 'medication', message: 'New prescription: Metformin 500mg', time: '3 hours ago', severity: 'normal' },
    { type: 'appointment', message: 'Appointment scheduled for next week', time: '1 day ago', severity: 'normal' },
    { type: 'alert', message: 'Lab results available for review', time: '2 days ago', severity: 'normal' },
  ];

  const quickActions = isDoctor ? [
    { label: 'Start Voice Session', icon: '🎤', action: 'voice' },
    { label: 'View Alerts', icon: '⚠️', action: 'alerts' },
    { label: 'Place Orders', icon: '📋', action: 'orders' },
    { label: 'Patient Portal', icon: '👥', action: 'portal' },
  ] : [
    { label: 'Voice Assistant', icon: '🎤', action: 'voice' },
    { label: 'View Records', icon: '📋', action: 'records' },
    { label: 'Manage Access', icon: '🔐', action: 'access' },
    { label: 'Schedule Visit', icon: '📅', action: 'schedule' },
  ];

  // Upcoming Appointments: have submitted info but no reports yet
  const upcomingAppointments = patients.filter(
    p => p.name && p.reason && (!patientReports[p.id] || patientReports[p.id].length === 0)
  );

  const [expandedReport, setExpandedReport] = React.useState(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Welcome back, {isDoctor ? `Dr. ${username || 'Smith'}` : (patientInfo?.name || 'John Doe')}!</h2>
          <p>Here's what's happening with your {isDoctor ? 'practice' : 'health'} today.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => handleCardClick('Appointments')} style={{ cursor: isDoctor ? 'pointer' : 'default' }}>
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{isDoctor ? (activePatients.length || 0) : 5}</div>
              <div className="stat-label">Appointments</div>
            </div>
          </div>
          <div className="stat-card" onClick={() => handleCardClick('Alerts')} style={{ cursor: isDoctor ? 'pointer' : 'default' }}>
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-value">{isDoctor ? 3 : 0}</div>
              <div className="stat-label">Pending Alerts</div>
            </div>
          </div>
          <div className="stat-card" onClick={() => handleCardClick('Orders')} style={{ cursor: isDoctor ? 'pointer' : 'default' }}>
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{isDoctor ? 12 : 0}</div>
              <div className="stat-label">Today's Orders</div>
            </div>
          </div>
          <div className="stat-card" onClick={() => handleCardClick('Voice Assistant')} style={{ cursor: isDoctor ? 'pointer' : 'default' }}>
            <div className="stat-icon">🎤</div>
            <div className="stat-content">
              <div className="stat-value">{isDoctor ? 8 : 0}</div>
              <div className="stat-label">Voice Sessions</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn" onClick={() => handleCardClick('Voice Assistant')}>
              <span className="action-icon">🎤</span>
              <span className="action-label">Start Voice Session</span>
            </button>
            <button className="quick-action-btn" onClick={() => handleCardClick('Alerts')}>
              <span className="action-icon">⚠️</span>
              <span className="action-label">View Alerts</span>
            </button>
            <button className="quick-action-btn" onClick={() => handleCardClick('Orders')}>
              <span className="action-icon">📋</span>
              <span className="action-label">Place Orders</span>
            </button>
            <button className="quick-action-btn" onClick={() => handleCardClick('Patient Portal')}>
              <span className="action-icon">👥</span>
              <span className="action-label">Patient Portal</span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="activities-section">
          <h3>Recent Activities</h3>
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className={`activity-item ${activity.severity}`}>
                <div className="activity-icon">
                  {activity.type === 'alert' && '⚠️'}
                  {activity.type === 'order' && '📋'}
                  {activity.type === 'voice' && '🎤'}
                  {activity.type === 'data' && '🔐'}
                  {activity.type === 'medication' && '💊'}
                  {activity.type === 'appointment' && '📅'}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
                {activity.severity === 'high' && <span className="severity-badge high">High</span>}
                {activity.severity === 'critical' && <span className="severity-badge critical">Critical</span>}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="ai-insights-section">
          <h3>🤖 AI Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Voice Recognition Accuracy</h4>
              <div className="accuracy-meter">
                <div className="accuracy-bar" style={{ width: '94%' }}></div>
                <span>94%</span>
              </div>
              <p>Your voice commands are being recognized with high accuracy</p>
            </div>
            <div className="insight-card">
              <h4>Recent Alerts</h4>
              <div className="alert-summary">
                <div className="alert-item">
                  <span className="alert-dot critical"></span>
                  <span>1 Critical</span>
                </div>
                <div className="alert-item">
                  <span className="alert-dot high"></span>
                  <span>2 High Priority</span>
                </div>
              </div>
              <p>Review alerts for potential issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 