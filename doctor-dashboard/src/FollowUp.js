import React from 'react';
import { FaUserMd, FaCalendarAlt, FaExclamationCircle, FaCheckCircle, FaClock } from 'react-icons/fa';

function getNextFollowUp(patient, reports) {
  if (!patient.lastVisit) return '—';
  const last = new Date(patient.lastVisit);
  last.setDate(last.getDate() + 30);
  return last.toISOString().split('T')[0];
}

function getFollowUpStatus(nextDate) {
  if (nextDate === '—') return { label: 'No follow-up', color: '#aaa', icon: <FaClock /> };
  const today = new Date();
  const next = new Date(nextDate);
  if (next < today) return { label: 'Overdue', color: '#e53e3e', icon: <FaExclamationCircle /> };
  if ((next - today) / (1000 * 60 * 60 * 24) < 7) return { label: 'Due Soon', color: '#d69e2e', icon: <FaClock /> };
  return { label: 'Scheduled', color: '#3182ce', icon: <FaCheckCircle /> };
}

export default function FollowUp({ patients = [], patientReports = {} }) {
  // Calculate summary stats
  const summary = patients.reduce((acc, p) => {
    const nextFollowUp = getNextFollowUp(p, patientReports[p.id]);
    const status = getFollowUpStatus(nextFollowUp).label;
    if (status === 'Overdue') acc.overdue++;
    if (status === 'Due Soon') acc.dueSoon++;
    if (status === 'Scheduled') acc.scheduled++;
    return acc;
  }, { overdue: 0, dueSoon: 0, scheduled: 0 });

  return (
    <div className="followup-container" style={{padding:'2rem', background:'#f6f8fa', minHeight:'100vh'}}>
      <h2 style={{display:'flex',alignItems:'center',gap:12}}><FaCalendarAlt style={{color:'#3182ce'}}/> Patient Follow-Up Tracker</h2>
      {/* Summary Cards */}
      <div style={{display:'flex',gap:24,margin:'32px 0'}}>
        <div style={{background:'#fff',borderRadius:12,padding:'18px 32px',boxShadow:'0 2px 8px #eee',display:'flex',alignItems:'center',gap:12,minWidth:160}}>
          <FaExclamationCircle style={{color:'#e53e3e',fontSize:28}}/>
          <div>
            <div style={{fontSize:22,fontWeight:700}}>{summary.overdue}</div>
            <div style={{color:'#e53e3e',fontWeight:600}}>Overdue</div>
          </div>
        </div>
        <div style={{background:'#fff',borderRadius:12,padding:'18px 32px',boxShadow:'0 2px 8px #eee',display:'flex',alignItems:'center',gap:12,minWidth:160}}>
          <FaClock style={{color:'#d69e2e',fontSize:28}}/>
          <div>
            <div style={{fontSize:22,fontWeight:700}}>{summary.dueSoon}</div>
            <div style={{color:'#d69e2e',fontWeight:600}}>Due Soon</div>
          </div>
        </div>
        <div style={{background:'#fff',borderRadius:12,padding:'18px 32px',boxShadow:'0 2px 8px #eee',display:'flex',alignItems:'center',gap:12,minWidth:160}}>
          <FaCheckCircle style={{color:'#3182ce',fontSize:28}}/>
          <div>
            <div style={{fontSize:22,fontWeight:700}}>{summary.scheduled}</div>
            <div style={{color:'#3182ce',fontWeight:600}}>Scheduled</div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',background:'#fff',borderRadius:12,boxShadow:'0 2px 8px #eee',marginTop:8,borderCollapse:'separate',borderSpacing:0}}>
          <thead>
            <tr style={{background:'#f1f5f9'}}>
              <th style={{padding:'14px 8px',fontWeight:700}}>Name</th>
              <th style={{padding:'14px 8px',fontWeight:700}}>Age</th>
              <th style={{padding:'14px 8px',fontWeight:700}}>Condition</th>
              <th style={{padding:'14px 8px',fontWeight:700}}>Last Visit</th>
              <th style={{padding:'14px 8px',fontWeight:700}}>Next Follow-Up</th>
              <th style={{padding:'14px 8px',fontWeight:700}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => {
              const nextFollowUp = getNextFollowUp(p, patientReports[p.id]);
              const statusObj = getFollowUpStatus(nextFollowUp);
              return (
                <tr key={p.id} style={{transition:'background 0.2s',cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.background='#f6f8fa'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                  <td style={{padding:'12px 8px',display:'flex',alignItems:'center',gap:8}}><FaUserMd style={{color:'#667eea'}}/> {p.name}</td>
                  <td style={{padding:'12px 8px'}}>{p.age}</td>
                  <td style={{padding:'12px 8px'}}>{p.condition}</td>
                  <td style={{padding:'12px 8px'}}>{p.lastVisit || '—'}</td>
                  <td style={{padding:'12px 8px'}}>{nextFollowUp}</td>
                  <td style={{padding:'12px 8px'}}>
                    <span style={{display:'inline-flex',alignItems:'center',gap:6,background:statusObj.color+'22',color:statusObj.color,padding:'4px 12px',borderRadius:16,fontWeight:600}}>
                      {statusObj.icon} {statusObj.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 