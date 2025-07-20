import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Placeholder lab results data
const sampleLabResults = [
  { name: 'HbA1c', value: 6.2, ref: '4.0-6.0' },
  { name: 'Cholesterol', value: 210, ref: '0-200' },
  { name: 'WBC', value: 7.1, ref: '4.0-11.0' },
  { name: 'Platelets', value: 250, ref: '150-400' },
  { name: 'Creatinine', value: 1.1, ref: '0.6-1.3' },
];

export default function LabResultsChart({ patient }) {
  // In a real app, filter lab results by patient
  const data = sampleLabResults;
  return (
    <div className="lab-results-chart-card">
      <div className="lab-results-title">Lab Results Overview</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3182ce" name="Result" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{marginTop:12,fontSize:13,color:'#888'}}>
        <strong>Reference Ranges:</strong> {data.map(d => `${d.name}: ${d.ref}`).join(' | ')}
      </div>
    </div>
  );
} 