import React from 'react';
import './Sidebar.css';

const doctorLinks = [
  'Dashboard',
  'Voice Assistant',
  'Medical Notes',
  'Alerts',
  'Orders',
  'Referrals',
  'Messages', // new link
  'Insights',
  'Follow Up',
  'Unified Patient Data View',
  'Settings',
  'Logout',
];

const patientLinks = [
  'Dashboard',
  'Health Assessment',
  'File Uploads',
  'Medications',
  'Medical Reports',
  'Messages',
  'Health Tracker',
  'Data Control',
  'Medical Records Access', // new link
  'Settings',
  'Logout',
];

export default function Sidebar({ currentView, setCurrentView, userRole, setUserRole }) {
  const links = userRole === 'doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <div className="logo">🤖</div>
        <div className="app-name">Doc Assist AI</div>
      </div>
      <nav>
        <ul>
          {links.map(link => (
            <li key={link}>
              <button 
                className={`sidebar-link${currentView === link ? ' active' : ''}`}
                aria-current={currentView === link ? 'page' : undefined}
                onClick={() => setCurrentView(link)}
              >
                {link}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="role-indicator">
          {userRole === 'doctor' ? '👨‍⚕️ Doctor Mode' : '👤 Patient Mode'}
        </div>
      </div>
    </aside>
  );
} 