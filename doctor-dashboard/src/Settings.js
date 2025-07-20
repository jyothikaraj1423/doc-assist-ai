import React, { useState } from 'react';
import './Settings.css';

export default function Settings({ userRole }) {
  const [settings, setSettings] = useState({
    voice: {
      language: 'en-US',
      autoStart: false,
      sensitivity: 'medium',
      transcriptionMode: 'real-time'
    },
    ai: {
      alertLevel: 'medium',
      autoProcess: true,
      fhirFormat: true,
      drugInteractionCheck: true,
      emergencyDetection: true
    },
    notifications: {
      email: true,
      push: false,
      criticalAlerts: true,
      dailySummary: false
    },
    privacy: {
      dataSharing: false,
      anonymizeData: true,
      auditLog: true,
      encryption: true
    },
    interface: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false,
      accessibility: false
    }
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        voice: {
          language: 'en-US',
          autoStart: false,
          sensitivity: 'medium',
          transcriptionMode: 'real-time'
        },
        ai: {
          alertLevel: 'medium',
          autoProcess: true,
          fhirFormat: true,
          drugInteractionCheck: true,
          emergencyDetection: true
        },
        notifications: {
          email: true,
          push: false,
          criticalAlerts: true,
          dailySummary: false
        },
        privacy: {
          dataSharing: false,
          anonymizeData: true,
          auditLog: true,
          encryption: true
        },
        interface: {
          theme: 'light',
          fontSize: 'medium',
          compactMode: false,
          accessibility: false
        }
      });
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        {/* Header */}
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <p>Configure Doc Assist AI to match your preferences and workflow</p>
        </div>

        {/* Settings Grid */}
        <div className="settings-grid">
          {/* Voice Settings */}
          <div className="settings-section">
            <h3>🎤 Voice Assistant</h3>
            <div className="setting-group">
              <label>Language</label>
              <select
                value={settings.voice.language}
                onChange={(e) => updateSetting('voice', 'language', e.target.value)}
                className="setting-input"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Auto-start Recording</label>
              <input
                type="checkbox"
                checked={settings.voice.autoStart}
                onChange={(e) => updateSetting('voice', 'autoStart', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Microphone Sensitivity</label>
              <select
                value={settings.voice.sensitivity}
                onChange={(e) => updateSetting('voice', 'sensitivity', e.target.value)}
                className="setting-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Transcription Mode</label>
              <select
                value={settings.voice.transcriptionMode}
                onChange={(e) => updateSetting('voice', 'transcriptionMode', e.target.value)}
                className="setting-input"
              >
                <option value="real-time">Real-time</option>
                <option value="batch">Batch Processing</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          {/* AI Settings */}
          <div className="settings-section">
            <h3>🤖 AI Configuration</h3>
            <div className="setting-group">
              <label>Alert Sensitivity Level</label>
              <select
                value={settings.ai.alertLevel}
                onChange={(e) => updateSetting('ai', 'alertLevel', e.target.value)}
                className="setting-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical Only</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Auto-process Voice Input</label>
              <input
                type="checkbox"
                checked={settings.ai.autoProcess}
                onChange={(e) => updateSetting('ai', 'autoProcess', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Generate FHIR Format</label>
              <input
                type="checkbox"
                checked={settings.ai.fhirFormat}
                onChange={(e) => updateSetting('ai', 'fhirFormat', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Drug Interaction Check</label>
              <input
                type="checkbox"
                checked={settings.ai.drugInteractionCheck}
                onChange={(e) => updateSetting('ai', 'drugInteractionCheck', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Emergency Symptom Detection</label>
              <input
                type="checkbox"
                checked={settings.ai.emergencyDetection}
                onChange={(e) => updateSetting('ai', 'emergencyDetection', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <h3>🔔 Notifications</h3>
            <div className="setting-group">
              <label>Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Push Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Critical Alert Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications.criticalAlerts}
                onChange={(e) => updateSetting('notifications', 'criticalAlerts', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Daily Summary</label>
              <input
                type="checkbox"
                checked={settings.notifications.dailySummary}
                onChange={(e) => updateSetting('notifications', 'dailySummary', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="settings-section">
            <h3>🔒 Privacy & Security</h3>
            <div className="setting-group">
              <label>Data Sharing for Research</label>
              <input
                type="checkbox"
                checked={settings.privacy.dataSharing}
                onChange={(e) => updateSetting('privacy', 'dataSharing', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Anonymize Patient Data</label>
              <input
                type="checkbox"
                checked={settings.privacy.anonymizeData}
                onChange={(e) => updateSetting('privacy', 'anonymizeData', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Audit Log</label>
              <input
                type="checkbox"
                checked={settings.privacy.auditLog}
                onChange={(e) => updateSetting('privacy', 'auditLog', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>End-to-End Encryption</label>
              <input
                type="checkbox"
                checked={settings.privacy.encryption}
                onChange={(e) => updateSetting('privacy', 'encryption', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
          </div>

          {/* Interface */}
          <div className="settings-section">
            <h3>🎨 Interface</h3>
            <div className="setting-group">
              <label>Theme</label>
              <select
                value={settings.interface.theme}
                onChange={(e) => updateSetting('interface', 'theme', e.target.value)}
                className="setting-input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Font Size</label>
              <select
                value={settings.interface.fontSize}
                onChange={(e) => updateSetting('interface', 'fontSize', e.target.value)}
                className="setting-input"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div className="setting-group">
              <label>Compact Mode</label>
              <input
                type="checkbox"
                checked={settings.interface.compactMode}
                onChange={(e) => updateSetting('interface', 'compactMode', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
            
            <div className="setting-group">
              <label>Accessibility Mode</label>
              <input
                type="checkbox"
                checked={settings.interface.accessibility}
                onChange={(e) => updateSetting('interface', 'accessibility', e.target.checked)}
                className="setting-checkbox"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button className="save-btn" onClick={() => alert('Settings saved successfully!')}>
            💾 Save Settings
          </button>
          <button className="reset-btn" onClick={resetSettings}>
            🔄 Reset to Default
          </button>
          <button className="export-btn" onClick={() => alert('Settings exported to file')}>
            📤 Export Settings
          </button>
        </div>

        {/* System Info */}
        <div className="system-info">
          <h3>ℹ️ System Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">App Version:</span>
              <span className="info-value">Doc Assist AI v1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">User Role:</span>
              <span className="info-value">{userRole === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Browser:</span>
              <span className="info-value">{navigator.userAgent.split(' ')[0]}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Voice Recognition:</span>
              <span className="info-value">
                {('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) ? '✅ Supported' : '❌ Not Supported'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 