import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './VitalsChart.css';

const data = [
  { name: '9:00', HeartRate: 78, BP: 120, Temp: 98.6 },
  { name: '10:00', HeartRate: 82, BP: 122, Temp: 98.7 },
  { name: '11:00', HeartRate: 80, BP: 119, Temp: 98.5 },
  { name: '12:00', HeartRate: 85, BP: 125, Temp: 98.9 },
  { name: '1:00', HeartRate: 79, BP: 118, Temp: 98.4 },
  { name: '2:00', HeartRate: 81, BP: 121, Temp: 98.6 },
];

export default function VitalsChart() {
  return (
    <div className="vitals-chart-card">
      <div className="vitals-title">Vitals Trends</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="HeartRate" stroke="#3182ce" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="BP" stroke="#38a169" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Temp" stroke="#e53e3e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 