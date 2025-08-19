import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Analytics.css';

const monthlyData = [
  { month: 'Jan', patients: 120, revenue: 15000 },
  { month: 'Feb', patients: 135, revenue: 16800 },
  { month: 'Mar', patients: 110, revenue: 14200 },
  { month: 'Apr', patients: 145, revenue: 18200 },
  { month: 'May', patients: 130, revenue: 16500 },
  { month: 'Jun', patients: 155, revenue: 19500 },
];

const patientTypes = [
  { name: 'Follow-up', value: 45, color: '#3182ce' },
  { name: 'New Patient', value: 25, color: '#38a169' },
  { name: 'Emergency', value: 15, color: '#e53e3e' },
  { name: 'Consultation', value: 15, color: '#d69e2e' },
];

export default function Analytics() {
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Practice Analytics</h2>
      </div>
      
      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Monthly Patient Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip />
              <Bar dataKey="patients" fill="#3182ce" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Patient Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={patientTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {patientTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stats-card">
          <h3>Key Metrics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">795</div>
              <div className="stat-label">Total Patients</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$99,200</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4.8</div>
              <div className="stat-label">Avg Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">92%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 