import React, { useState } from 'react';
import './Alerts.css';

export default function Alerts({ userRole }) {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'Drug Interaction',
      severity: 'critical',
      message: 'Potential interaction detected: Aspirin + Warfarin',
      patient: 'John Smith',
      timestamp: '2024-01-15 14:30',
      source: 'Voice Assistant',
      acknowledged: false,
      overridden: false,
      details: 'Both medications can increase bleeding risk. Consider alternative or monitoring.',
      citation: 'Drug Interaction Database v2.1'
    },
    {
      id: 2,
      type: 'Emergency Symptom',
      severity: 'critical',
      message: 'Emergency symptom detected: Chest pain with ST elevation',
      patient: 'Sarah Johnson',
      timestamp: '2024-01-15 13:45',
      source: 'Medical Notes',
      acknowledged: false,
      overridden: false,
      details: 'ST elevation on EKG suggests acute myocardial infarction. Immediate intervention required.',
      citation: 'American Heart Association Guidelines 2023'
    },
    {
      id: 3,
      type: 'Dose Conflict',
      severity: 'high',
      message: 'Dose conflict detected: Metformin dosage exceeds recommended limit',
      patient: 'Mike Wilson',
      timestamp: '2024-01-15 12:20',
      source: 'Prescription System',
      acknowledged: true,
      overridden: false,
      details: 'Current dose: 2000mg BID. Recommended max: 2550mg daily.',
      citation: 'FDA Metformin Guidelines'
    },
    {
      id: 4,
      type: 'Lab Result',
      severity: 'medium',
      message: 'Abnormal lab result: Elevated creatinine levels',
      patient: 'Lisa Brown',
      timestamp: '2024-01-15 11:15',
      source: 'Lab System',
      acknowledged: false,
      overridden: false,
      details: 'Creatinine: 2.1 mg/dL (Normal: 0.6-1.2). Monitor kidney function.',
      citation: 'Clinical Laboratory Standards'
    }
  ]);

  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'acknowledged' && alert.acknowledged) ||
      (filterStatus === 'pending' && !alert.acknowledged && !alert.overridden) ||
      (filterStatus === 'overridden' && alert.overridden);
    return matchesSeverity && matchesStatus;
  });

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const overrideAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, overridden: true, acknowledged: true } : alert
    ));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#e53e3e';
      case 'high': return '#d69e2e';
      case 'medium': return '#3182ce';
      case 'low': return '#38a169';
      default: return '#718096';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '📊';
      case 'low': return 'ℹ️';
      default: return '📋';
    }
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const highCount = alerts.filter(a => a.severity === 'high' && !a.acknowledged).length;

  return (
    <div className="alerts-container">
      <div className="alerts-content">
        {/* Header */}
        <div className="alerts-header">
          <h2>⚠️ Medical Alerts</h2>
          <p>Real-time alerts and safety notifications with AI-powered detection</p>
        </div>

        {/* Alert Summary */}
        <div className="alert-summary">
          <div className="summary-card critical">
            <div className="summary-icon">🚨</div>
            <div className="summary-content">
              <div className="summary-count">{criticalCount}</div>
              <div className="summary-label">Critical Alerts</div>
            </div>
          </div>
          <div className="summary-card high">
            <div className="summary-icon">⚠️</div>
            <div className="summary-content">
              <div className="summary-count">{highCount}</div>
              <div className="summary-label">High Priority</div>
            </div>
          </div>
          <div className="summary-card total">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <div className="summary-count">{alerts.length}</div>
              <div className="summary-label">Total Alerts</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="alerts-filters">
          <div className="filter-group">
            <label>Severity:</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="overridden">Overridden</option>
            </select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="alerts-list">
          {filteredAlerts.map(alert => (
            <div key={alert.id} className={`alert-card ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''} ${alert.overridden ? 'overridden' : ''}`}>
              <div className="alert-header">
                <div className="alert-type">
                  <span className="alert-icon">{getSeverityIcon(alert.severity)}</span>
                  <span className="alert-title">{alert.type}</span>
                </div>
                <div className="alert-meta">
                  <span className="alert-patient">{alert.patient}</span>
                  <span className="alert-time">{alert.timestamp}</span>
                </div>
              </div>
              
              <div className="alert-message">
                {alert.message}
              </div>
              
              <div className="alert-details">
                <div className="detail-item">
                  <strong>Source:</strong> {alert.source}
                </div>
                <div className="detail-item">
                  <strong>Details:</strong> {alert.details}
                </div>
                <div className="detail-item">
                  <strong>Citation:</strong> {alert.citation}
                </div>
              </div>

              {!alert.acknowledged && !alert.overridden && (
                <div className="alert-actions">
                  <button
                    className="action-btn acknowledge"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    ✓ Acknowledge
                  </button>
                  <button
                    className="action-btn override"
                    onClick={() => overrideAlert(alert.id)}
                  >
                    ✗ Override
                  </button>
                </div>
              )}

              {alert.acknowledged && (
                <div className="alert-status">
                  <span className="status-badge acknowledged">✓ Acknowledged</span>
                  {alert.overridden && <span className="status-badge overridden">✗ Overridden</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="no-alerts">
            <div className="no-alerts-icon">✅</div>
            <h3>No alerts match your filters</h3>
            <p>All clear! No alerts found for the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 