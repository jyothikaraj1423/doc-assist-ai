import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import VoiceAssistant from './VoiceAssistant';
import MedicalNotes from './MedicalNotes';
import Alerts from './Alerts';
import Orders from './Orders';
import PatientPortal from './PatientPortal';
import Settings from './Settings';
import Patients from './Patients';
import DoctorPortal from './DoctorPortal';
import Analytics from './Analytics';
import FollowUp from './FollowUp';
import UnifiedPatientDataView from './UnifiedPatientDataView';
import MedicalRecordsAccess from './MedicalRecordsAccess';
import Messages from './Messages';

function Login({ onLogin, onShowRegister, onShowReset, rememberMe, setRememberMe }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  return (
    <div className="login-container">
      <div className="login-logo">🤖 Doc Assist AI</div>
      <h2>Login</h2>
      <input type="text" placeholder="Username or Email" value={usernameOrEmail} onChange={e => setUsernameOrEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <div>
        <label><input type="radio" checked={role==='patient'} onChange={()=>setRole('patient')} /> Patient</label>
        <label><input type="radio" checked={role==='doctor'} onChange={()=>setRole('doctor')} /> Doctor</label>
      </div>
      <div style={{width:'100%',margin:'8px 0 16px 0',textAlign:'left'}}>
        <label style={{fontSize:'1rem',color:'#495057'}}>
          <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{marginRight:8}} /> Remember Me
        </label>
      </div>
      <button onClick={() => onLogin(usernameOrEmail, password, role)}>Login</button>
      <button onClick={onShowRegister}>Create Account</button>
      <button style={{background:'#f8f9fa',color:'#3182ce',border:'none',marginTop:8}} onClick={onShowReset}>Forgot Password?</button>
    </div>
  );
}

function Register({ onRegister, onShowLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('patient');
  return (
    <div className="login-container">
      <div className="login-logo">🤖 Doc Assist AI</div>
      <h2>Create Account</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      <div>
        <label><input type="radio" checked={role==='patient'} onChange={()=>setRole('patient')} /> Patient</label>
        <label><input type="radio" checked={role==='doctor'} onChange={()=>setRole('doctor')} /> Doctor</label>
      </div>
      <button onClick={() => onRegister(username, email, password, confirm, role)}>Create Account</button>
      <button onClick={onShowLogin}>Back to Login</button>
    </div>
  );
}

function ResetPassword({ onReset, onShowLogin, users }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  return (
    <div className="login-container">
      <div className="login-logo">🤖 Doc Assist AI</div>
      <h2>Reset Password</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      <button onClick={() => {
        if (!email || !newPassword || newPassword !== confirm) {
          setMessage('Please fill all fields and make sure passwords match.');
          return;
        }
        if (!users.some(u => u.email === email)) {
          setMessage('No account found with that email.');
          return;
        }
        onReset(email, newPassword);
        setMessage('Password reset! You can now log in.');
      }}>Reset Password</button>
      <button onClick={onShowLogin}>Back to Login</button>
      {message && <div style={{color:'#3182ce',marginTop:8}}>{message}</div>}
    </div>
  );
}

function VerifyEmail({ email, onVerify }) {
  return (
    <div className="login-container">
      <div className="login-logo">🤖 Doc Assist AI</div>
      <h2>Email Verification</h2>
      <p style={{marginBottom:24}}>A verification link has been sent to <b>{email}</b>.<br/> (Demo: Click below to verify.)</p>
      <button onClick={onVerify}>Verify Email</button>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('Dashboard'); // Restore default to Dashboard
  const [userRole, setUserRole] = useState('doctor'); // Restore default to doctor
  // Initialize patients from localStorage if available, merged with demo patients
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('docassist_patients');
    if (saved) {
      return JSON.parse(saved);
    }
    // Start with empty patients array
    return [];
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientInfo, setPatientInfo] = useState(patients[0]);
  // Initialize patientReports from localStorage if available
  const [patientReports, setPatientReports] = useState(() => {
    const saved = localStorage.getItem('docassist_patientReports');
    return saved ? JSON.parse(saved) : {};
  });
  // Load users and auth from localStorage if available
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('docassist_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('docassist_auth');
    return saved ? JSON.parse(saved) : null;
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [pendingVerify, setPendingVerify] = useState(null); // email
  const [rememberMe, setRememberMe] = useState(() => {
    const saved = localStorage.getItem('docassist_rememberMe');
    return saved ? JSON.parse(saved) : false;
  });

  // Set currentView based on role after login
  React.useEffect(() => {
    if (auth) {
      if (auth.role === 'doctor') setCurrentView('Dashboard');
      else setCurrentView('Dashboard'); // Patient portal default
    }
  }, [auth]);

  // Persist users and auth to localStorage
  React.useEffect(() => {
    localStorage.setItem('docassist_users', JSON.stringify(users));
  }, [users]);
  React.useEffect(() => {
    if (auth) localStorage.setItem('docassist_auth', JSON.stringify(auth));
    else localStorage.removeItem('docassist_auth');
  }, [auth]);
  React.useEffect(() => {
    if (rememberMe && auth) localStorage.setItem('docassist_auth', JSON.stringify(auth));
    if (!rememberMe) localStorage.removeItem('docassist_auth');
    localStorage.setItem('docassist_rememberMe', JSON.stringify(rememberMe));
  }, [auth, rememberMe]);

  // Persist patients to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('docassist_patients', JSON.stringify(patients));
  }, [patients]);

  // Persist patientReports to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('docassist_patientReports', JSON.stringify(patientReports));
  }, [patientReports]);

  // Reload patients from localStorage whenever a doctor logs in
  React.useEffect(() => {
    if (auth && auth.role === 'doctor') {
      const saved = localStorage.getItem('docassist_patients');
      setPatients(saved ? JSON.parse(saved) : []);
    }
  }, [auth]);

  const updatePatientInfo = (info) => {
    setPatientInfo(info);
    setPatients(prev => prev.map(p => p.id === info.id ? { ...p, ...info } : p));
    if (selectedPatient && selectedPatient.id === info.id) {
      setSelectedPatient({ ...selectedPatient, ...info });
    }
  };

  const handleReportSubmit = (report) => {
    if (!selectedPatient && !patientInfo) return;
    const pid = (selectedPatient || patientInfo).id;
    setPatientReports(prev => {
      const prevReports = prev[pid] || [];
      return { ...prev, [pid]: [report, ...prevReports] };
    });

    // Also update the patient in localStorage
    const saved = localStorage.getItem('docassist_patients');
    let localPatients = saved ? JSON.parse(saved) : [];
    const idx = localPatients.findIndex(p => p.id === pid);
    if (idx !== -1) {
      localPatients[idx].reports = localPatients[idx].reports || [];
      localPatients[idx].reports.unshift(report);
      // Add prescribed medications to patient's medication list
      if (report.medications && Array.isArray(report.medications)) {
        localPatients[idx].medications = localPatients[idx].medications || [];
        report.medications.forEach(med => {
          if (!localPatients[idx].medications.some(m => m.name === med.name)) {
            localPatients[idx].medications.push(med);
          }
        });
      }
      localStorage.setItem('docassist_patients', JSON.stringify(localPatients));
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientInfo(patient);
  };

  const handleStartConsultation = (patient) => {
    setSelectedPatient(patient);
    setPatientInfo(patient);
    setCurrentView('Voice Assistant');
  };

  const handleLogin = (usernameOrEmail, password, role) => {
    console.log('Login attempt:', { usernameOrEmail, password, role });
    console.log('Available users:', users);
    
    const user = users.find(u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password && u.role === role);
    
    if (!user) {
      console.log('Login failed: Invalid credentials');
      alert('Invalid credentials');
      return;
    }
    
    if (!user.verified) {
      console.log('Login failed: User not verified');
      setPendingVerify(user.email);
      return;
    }
    
    console.log('Login successful:', user);
    setAuth({ username: user.username, email: user.email, role: user.role });
    
    // Set the appropriate view based on role
    if (role === 'doctor') {
      console.log('Setting view to Dashboard for doctor');
      setCurrentView('Dashboard');
    } else {
      console.log('Setting view to Dashboard for patient');
      setCurrentView('Dashboard');
    }
    
    if (role === 'patient') {
      // Set patientInfo to the patient object matching this user
      const patient = patients.find(p => p.email === user.email || p.name === user.username);
      if (patient) {
        console.log('Setting patient info:', patient);
        setPatientInfo(patient);
      }
    }
    
    if (rememberMe) {
      localStorage.setItem('docassist_auth', JSON.stringify({ username: user.username, email: user.email, role: user.role }));
      localStorage.setItem('docassist_rememberMe', 'true');
    } else {
      localStorage.removeItem('docassist_auth');
      localStorage.setItem('docassist_rememberMe', 'false');
    }
    
    console.log('Login process completed');
  };
  const handleRegister = (username, email, password, confirm, role) => {
    if (!username || !email || !password || password !== confirm) {
      alert('Please fill all fields and make sure passwords match.');
      return;
    }
    if (users.some(u => u.username === username || u.email === email)) {
      alert('Username or email already exists.');
      return;
    }
    setUsers([...users, { username, email, password, role, verified: false }]);
    if (role === 'patient') {
      // Add new patient to patients array with unique id
      const newPatient = {
        id: Date.now() + Math.floor(Math.random() * 1000000),
        name: username,
        email,
        age: '',
        lastVisit: '',
        condition: '',
        status: 'pending',
      };
      setPatients(prev => [...prev, newPatient]);
      // Also update localStorage directly
      const saved = localStorage.getItem('docassist_patients');
      const localPatients = saved ? JSON.parse(saved) : [];
      localPatients.push(newPatient);
      localStorage.setItem('docassist_patients', JSON.stringify(localPatients));
      console.log('After registration, docassist_patients:', localPatients);
    }
    setShowRegister(false);
    setPendingVerify(email);
    alert('Account created! Please verify your email.');
  };
  const handleReset = (email, newPassword) => {
    setUsers(users.map(u => u.email === email ? { ...u, password: newPassword } : u));
    setShowReset(false);
  };
  const handleVerify = () => {
    setUsers(users.map(u => u.email === pendingVerify ? { ...u, verified: true } : u));
    setPendingVerify(null);
    alert('Email verified! You can now log in.');
  };
  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('docassist_auth');
  };

  // Manual refresh for doctors to reload patients from localStorage
  const handleRefreshPatients = () => {
    const saved = localStorage.getItem('docassist_patients');
    setPatients(saved ? JSON.parse(saved) : []);
  };

  // Get the current doctor's username for patient messaging
  const getCurrentDoctor = () => {
    // In a real app, this would come from the current session or patient-doctor assignment
    // For now, we'll use the first available doctor or a default
    const savedPatients = localStorage.getItem('docassist_patients');
    if (savedPatients) {
      const patients = JSON.parse(savedPatients);
      // Find a doctor from the patients list or use default
      const doctor = patients.find(p => p.role === 'doctor') || { username: 'manasaa' };
      return doctor.username;
    }
    return 'manasaa'; // Default doctor
  };

  if (pendingVerify) {
    return <VerifyEmail email={pendingVerify} onVerify={handleVerify} />;
  }
  if (!auth) {
    if (showReset) return <ResetPassword onReset={handleReset} onShowLogin={()=>setShowReset(false)} users={users} />;
    return showRegister ? <Register onRegister={handleRegister} onShowLogin={()=>setShowRegister(false)} /> : <Login onLogin={handleLogin} onShowRegister={()=>setShowRegister(true)} onShowReset={()=>setShowReset(true)} rememberMe={rememberMe} setRememberMe={setRememberMe} />;
  }

  const renderContent = () => {
    console.log('renderContent called with:', { 
      authRole: auth?.role, 
      currentView, 
      auth: auth 
    });
    
    if (auth.role === 'doctor') {
      console.log('Rendering doctor view for:', currentView);
      switch (currentView) {
        case 'Dashboard':
          return <Dashboard userRole={auth.role} patientInfo={selectedPatient || patientInfo} patients={patients} patientReports={patientReports} onStartConsultation={handleStartConsultation} selectedPatient={selectedPatient} setCurrentView={setCurrentView} username={auth.username} />;
        case 'Voice Assistant':
          return <VoiceAssistant userRole={auth.role} selectedPatient={selectedPatient} onReportSubmit={handleReportSubmit} />;
        case 'Medical Notes':
          return <MedicalNotes userRole={auth.role} />;
        case 'Alerts':
          return <Alerts userRole={auth.role} />;
        case 'Orders':
          return <Orders userRole={auth.role} />;
        case 'Referrals':
          return <DoctorPortal userRole={auth.role} patients={patients} patientReports={patientReports} />;
        case 'Patient Portal':
          return <PatientPortal userRole={auth.role} patientInfo={selectedPatient || patientInfo} setPatientInfo={updatePatientInfo} patientReports={patientReports[(selectedPatient || patientInfo)?.id] || []} onUpdatePatient={updatedInfo => setPatients(prev => prev.map(p => p.id === updatedInfo.id ? updatedInfo : p))} username={auth.username} />;
        case 'Doctor Portal':
          return <DoctorPortal userRole={auth.role} patients={patients} patientReports={patientReports} />;
        case 'Settings':
          return <Settings userRole={auth.role} />;
        case 'Patients':
          return <Patients patients={patients} onSelect={handleSelectPatient} />;
        case 'Appointments':
          return <Patients patients={patients} onSelect={handleSelectPatient} />;
        case 'Insights':
          return <Analytics userRole={auth.role} patients={patients} patientReports={patientReports} />;
        case 'Follow Up':
          return <FollowUp userRole={auth.role} patients={patients} patientReports={patientReports} />;
        case 'Unified Patient Data View':
          return <UnifiedPatientDataView />;
        case 'Messages':
          return <Messages userRole={auth.role} username={auth.username} patients={patients} />;
        case 'Logout':
          handleLogout();
          return null;
        default:
          console.log('Default case: rendering Dashboard for doctor');
          return <Dashboard userRole={auth.role} />;
      }
    }
    // Patient view: render selected feature from sidebar
    console.log('Rendering patient view for:', currentView);
    switch (currentView) {
      case 'Dashboard':
      case 'Health Assessment':
      case 'File Uploads':
      case 'Medications':
      case 'Messages':
      case 'Health Tracker':
      case 'Data Control':
      case 'Resources':
        return <PatientPortal userRole={auth.role} patientInfo={patientInfo} setPatientInfo={updatePatientInfo} patientReports={patientReports[patientInfo?.id] || []} currentView={currentView} setCurrentView={setCurrentView} username={auth.username} doctorUsername={getCurrentDoctor()} />;
      case 'Medical Records Access':
        return <MedicalRecordsAccess patientInfo={patientInfo} patientReports={patientReports[patientInfo?.id] || []} />;
      case 'Settings':
        return <Settings userRole={auth.role} />;
      case 'Logout':
        handleLogout();
        return null;
      default:
        console.log('Default case: rendering PatientPortal for patient');
        return <PatientPortal userRole={auth.role} patientInfo={patientInfo} setPatientInfo={updatePatientInfo} patientReports={patientReports[patientInfo?.id] || []} currentView={currentView} setCurrentView={setCurrentView} username={auth.username} doctorUsername={getCurrentDoctor()} />;
    }
  };

  return (
    <div className="dashboard-bg">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        userRole={auth.role}
        setUserRole={() => {}}
        onLogout={handleLogout}
      />
      <main className="dashboard-main">
        <div className="app-header">
          <h1 className="dashboard-title">Doc Assist AI</h1>
          <div className="user-info">
            <span className="user-role">{auth.role === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}</span>
            {auth.role === 'doctor' && selectedPatient && (
              <span className="selected-patient"> | Patient: {selectedPatient.name} ({selectedPatient.age} yrs, {selectedPatient.condition})</span>
            )}
            {auth.role === 'doctor' && (
              <button onClick={handleRefreshPatients} style={{marginLeft:16, padding:'4px 12px', borderRadius:6, background:'#3182ce', color:'#fff', border:'none', cursor:'pointer'}}>
                Refresh Patients
              </button>
            )}
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
