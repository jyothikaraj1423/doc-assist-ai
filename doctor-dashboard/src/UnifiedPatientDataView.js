import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const patientData = [
  { id: 'P001', name: 'Anjali Rao', age: 42, gender: 'F', diagnosis: 'Type 2 Diabetes', bp: '145/90', glucose: 198, weight: 74, bmi: 28.7, hr: 84, spo2: 96, lastVisit: '2025-07-15', medications: 'Metformin', risk: 'High', nextAppt: '2025-08-01' },
  { id: 'P002', name: 'Ravi Teja', age: 55, gender: 'M', diagnosis: 'Hypertension', bp: '160/100', glucose: 110, weight: 82, bmi: 27.5, hr: 92, spo2: 94, lastVisit: '2025-07-10', medications: 'Amlodipine', risk: 'Medium', nextAppt: '2025-07-25' },
  { id: 'P003', name: 'Lakshmi Iyer', age: 29, gender: 'F', diagnosis: 'PCOS', bp: '118/80', glucose: 92, weight: 68, bmi: 25.2, hr: 78, spo2: 98, lastVisit: '2025-07-17', medications: 'Myo-Inositol', risk: 'Low', nextAppt: '2025-08-10' },
  { id: 'P004', name: 'Syed Ameen', age: 60, gender: 'M', diagnosis: 'Heart Disease', bp: '150/95', glucose: 180, weight: 85, bmi: 30.0, hr: 88, spo2: 91, lastVisit: '2025-07-12', medications: 'Atorvastatin, Aspirin', risk: 'High', nextAppt: '2025-07-28' },
  { id: 'P005', name: 'Meena Kumari', age: 34, gender: 'F', diagnosis: 'Asthma', bp: '125/85', glucose: 98, weight: 60, bmi: 24.8, hr: 95, spo2: 93, lastVisit: '2025-07-16', medications: 'Salbutamol Inhaler', risk: 'Medium', nextAppt: '2025-08-02' },
  { id: 'P006', name: 'Arjun Reddy', age: 45, gender: 'M', diagnosis: 'Pre-Diabetes', bp: '130/88', glucose: 135, weight: 89, bmi: 29.6, hr: 82, spo2: 97, lastVisit: '2025-07-13', medications: 'Lifestyle Modification', risk: 'Medium', nextAppt: '2025-08-05' },
];

const riskColors = { High: '#e53e3e', Medium: '#d69e2e', Low: '#38a169' };

export default function UnifiedPatientDataView() {
  // Prepare data for charts
  const glucoseData = patientData.map(p => ({ name: p.name, Glucose: p.glucose }));
  const bmiData = patientData.map(p => ({ name: p.name, BMI: p.bmi }));
  const riskDist = [
    { name: 'High', value: patientData.filter(p => p.risk === 'High').length, color: riskColors.High },
    { name: 'Medium', value: patientData.filter(p => p.risk === 'Medium').length, color: riskColors.Medium },
    { name: 'Low', value: patientData.filter(p => p.risk === 'Low').length, color: riskColors.Low },
  ];

  return (
    <div style={{padding:'2rem',background:'#f6f8fa',minHeight:'100vh'}}>
      <h2 style={{marginBottom:24}}>📁 Unified Patient Data View</h2>
      <div style={{display:'flex',gap:32,flexWrap:'wrap',marginBottom:32}}>
        <div style={{background:'#fff',borderRadius:12,padding:24,boxShadow:'0 2px 8px #eee',flex:'1 1 320px',minWidth:320}}>
          <h3>Glucose Levels</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={glucoseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize:12}}/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="Glucose" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:'#fff',borderRadius:12,padding:24,boxShadow:'0 2px 8px #eee',flex:'1 1 320px',minWidth:320}}>
          <h3>BMI Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bmiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize:12}}/>
              <YAxis />
              <Tooltip />
              <Bar dataKey="BMI" fill="#38a169" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:'#fff',borderRadius:12,padding:24,boxShadow:'0 2px 8px #eee',flex:'1 1 320px',minWidth:320}}>
          <h3>Risk Level Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={riskDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {riskDist.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',background:'#fff',borderRadius:12,boxShadow:'0 2px 8px #eee',marginTop:8,borderCollapse:'separate',borderSpacing:0}}>
          <thead>
            <tr style={{background:'#f1f5f9'}}>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Diagnosis</th>
              <th>BP (mmHg)</th>
              <th>Glucose</th>
              <th>Weight (kg)</th>
              <th>BMI</th>
              <th>Heart Rate</th>
              <th>SpO2 (%)</th>
              <th>Last Visit</th>
              <th>Medications</th>
              <th>Risk Level</th>
              <th>Next Appt.</th>
            </tr>
          </thead>
          <tbody>
            {patientData.map(p => (
              <tr key={p.id} style={{transition:'background 0.2s',cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.background='#f6f8fa'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.diagnosis}</td>
                <td>{p.bp}</td>
                <td>{p.glucose}</td>
                <td>{p.weight}</td>
                <td>{p.bmi}</td>
                <td>{p.hr}</td>
                <td>{p.spo2}</td>
                <td>{p.lastVisit}</td>
                <td>{p.medications}</td>
                <td><span style={{color:riskColors[p.risk],fontWeight:600}}>{p.risk}</span></td>
                <td>{p.nextAppt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:32,color:'#888',fontSize:14}}>
        <strong>DataNFTs, history, trends...</strong> (Demo: Data is static for now. Integrate with backend for live data and NFT features.)
      </div>
    </div>
  );
} 