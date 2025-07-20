import React, { useState } from 'react';

const diagnosesData = [
  { date: '2023-11-10', diagnosis: 'Type 2 Diabetes', status: 'Chronic', notes: 'Stable, managed with medication.' },
  { date: '2022-06-15', diagnosis: 'Hypertension', status: 'Chronic', notes: 'Requires regular monitoring.' },
  { date: '2021-03-22', diagnosis: 'Seasonal Allergies', status: 'Resolved', notes: 'No symptoms in last 12 months.' },
];

const labReportsData = [
  { date: '2024-01-10', test: 'CBC', result: 'Normal', pdf: '/sample-cbc.pdf' },
  { date: '2023-12-05', test: 'HbA1c', result: '7.2% (High)', pdf: '/sample-hba1c.pdf' },
  { date: '2023-10-18', test: 'Lipid Profile', result: 'Borderline High Cholesterol', pdf: '/sample-lipid.pdf' },
];

const visitHistoryData = [
  { date: '2024-01-10', summary: 'Routine diabetes checkup. Adjusted metformin dose.', doctor: 'Dr. Smith', notes: 'Patient doing well. Continue current plan.' },
  { date: '2023-12-05', summary: 'Follow-up for hypertension.', doctor: 'Dr. Lee', notes: 'BP slightly elevated. Advised lifestyle changes.' },
];

const surgicalHistoryData = [
  { date: '2020-08-12', procedure: 'Appendectomy', hospital: 'City Hospital', outcome: 'Successful, no complications.' },
];

const allergiesData = [
  { type: 'Allergy', name: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
  { type: 'Immunization', name: 'COVID-19 Vaccine', date: '2021-04-15', status: 'Completed' },
  { type: 'Immunization', name: 'Influenza Vaccine', date: '2023-10-01', status: 'Completed' },
];

const chronicDiseaseData = [
  { disease: 'Diabetes', since: '2023', control: 'Moderate', lastA1c: '7.2%' },
  { disease: 'Hypertension', since: '2022', control: 'Good', lastBP: '128/82' },
];

const tabs = [
  { key: 'diagnoses', label: 'Diagnoses & Conditions' },
  { key: 'labs', label: 'Lab Reports & Test Results' },
  { key: 'visits', label: 'Visit History' },
  { key: 'surgical', label: 'Surgical/Procedure History' },
  { key: 'allergies', label: 'Allergies & Immunizations' },
  { key: 'chronic', label: 'Chronic Disease Summary' },
];

export default function MedicalRecordsAccess({ patientInfo, patientReports }) {
  const [activeTab, setActiveTab] = useState('diagnoses');
  return (
    <div style={{padding:'2rem', maxWidth:900, margin:'0 auto'}}>
      <h2 style={{marginBottom:24}}>📁 Medical Records Access</h2>
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding:'10px 18px',
              borderRadius:8,
              border:'none',
              background: activeTab === tab.key ? '#3182ce' : '#e2e8f0',
              color: activeTab === tab.key ? '#fff' : '#2d3748',
              fontWeight:600,
              cursor:'pointer',
              fontSize:'1em',
              transition:'background 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{background:'#fff',borderRadius:12,padding:24,boxShadow:'0 2px 8px #eee'}}>
        {activeTab === 'diagnoses' && (
          <div>
            <h3>Diagnoses & Conditions</h3>
            <table style={{width:'100%',marginTop:12}}>
              <thead>
                <tr><th>Date</th><th>Diagnosis</th><th>Status</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {diagnosesData.map((d,i) => (
                  <tr key={i}><td>{d.date}</td><td>{d.diagnosis}</td><td>{d.status}</td><td>{d.notes}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'labs' && (
          <div>
            <h3>Lab Reports & Test Results</h3>
            <table style={{width:'100%',marginTop:12}}>
              <thead>
                <tr><th>Date</th><th>Test</th><th>Result</th><th>Download</th></tr>
              </thead>
              <tbody>
                {labReportsData.map((l,i) => (
                  <tr key={i}>
                    <td>{l.date}</td><td>{l.test}</td><td>{l.result}</td>
                    <td><a href={l.pdf} download style={{color:'#3182ce'}}>PDF</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'visits' && (
          <div>
            <h3>Visit History</h3>
            <table style={{width:'100%',marginTop:12}}>
              <thead>
                <tr><th>Date</th><th>Summary</th><th>Doctor</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {visitHistoryData.map((v,i) => (
                  <tr key={i}><td>{v.date}</td><td>{v.summary}</td><td>{v.doctor}</td><td>{v.notes}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'surgical' && (
          <div>
            <h3>Surgical/Procedure History</h3>
            <table style={{width:'100%',marginTop:12}}>
              <thead>
                <tr><th>Date</th><th>Procedure</th><th>Hospital</th><th>Outcome</th></tr>
              </thead>
              <tbody>
                {surgicalHistoryData.map((s,i) => (
                  <tr key={i}><td>{s.date}</td><td>{s.procedure}</td><td>{s.hospital}</td><td>{s.outcome}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'allergies' && (
          <div>
            <h3>Allergies & Immunizations</h3>
            <table style={{width:'100%',marginTop:12}}>
              <thead>
                <tr><th>Type</th><th>Name</th><th>Reaction/Date</th><th>Severity/Status</th></tr>
              </thead>
              <tbody>
                {allergiesData.map((a,i) => (
                  <tr key={i}>
                    <td>{a.type}</td>
                    <td>{a.name}</td>
                    <td>{a.type === 'Allergy' ? a.reaction : a.date}</td>
                    <td>{a.type === 'Allergy' ? a.severity : a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'chronic' && (
          <div>
            <h3>Chronic Disease Summary</h3>
            <table style={{width:'100%',marginTop:12}}>
              <thead>
                <tr><th>Disease</th><th>Since</th><th>Control</th><th>Last A1c/BP</th></tr>
              </thead>
              <tbody>
                {chronicDiseaseData.map((c,i) => (
                  <tr key={i}>
                    <td>{c.disease}</td>
                    <td>{c.since}</td>
                    <td>{c.control}</td>
                    <td>{c.lastA1c || c.lastBP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 