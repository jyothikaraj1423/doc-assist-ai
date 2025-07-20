import React, { useEffect, useState } from 'react';

export default function SharedReport() {
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const token = window.location.pathname.split('/').pop();
    const shareLinks = JSON.parse(localStorage.getItem('docassist_reportShareLinks') || '{}');
    const link = shareLinks[token];
    if (!link || !link.active) {
      setStatus('revoked');
      return;
    }
    const allReports = JSON.parse(localStorage.getItem('docassist_patientReports') || '{}');
    const patientReports = allReports[link.patientId] || [];
    const reportData = patientReports[link.reportIdx];
    if (!reportData) {
      setStatus('notfound');
      return;
    }
    setReport(reportData);
    setStatus('ok');
  }, []);

  if (status === 'loading') return <div style={{padding:40, textAlign:'center'}}>Loading report...</div>;
  if (status === 'revoked') return <div style={{padding:40, textAlign:'center', color:'#e53e3e'}}>This share link has been revoked or is invalid.</div>;
  if (status === 'notfound') return <div style={{padding:40, textAlign:'center', color:'#e53e3e'}}>Report not found.</div>;

  return (
    <div style={{maxWidth:600,margin:'40px auto',background:'#fff',borderRadius:12,padding:32,boxShadow:'0 2px 12px #eee'}}>
      <h2>📄 Shared Medical Report</h2>
      <div><strong>Date:</strong> {report.date || report.effectiveDateTime ? new Date(report.date || report.effectiveDateTime).toLocaleString() : 'Unknown'}</div>
      <div><strong>Symptoms:</strong> {Array.isArray(report.symptoms) ? report.symptoms.join(', ') : (report.symptoms || 'None')}</div>
      <div><strong>Medications:</strong> {Array.isArray(report.medications) ? report.medications.join(', ') : (report.medications || 'None')}</div>
      <div><strong>Notes:</strong> <pre style={{whiteSpace:'pre-wrap',background:'none',padding:0}}>{report.notes || (report.valueString || '')}</pre></div>
      <div style={{marginTop:24, color:'#888', fontSize:'0.95em'}}>Powered by Doc Assist AI</div>
    </div>
  );
} 