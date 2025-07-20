import React from 'react';
import './OverviewCards.css';

const metrics = [
  {
    label: "Today's Appointments",
    value: 12,
    color: '#3182ce',
  },
  {
    label: 'Pending Lab Reports',
    value: 4,
    color: '#e53e3e',
  },
  {
    label: 'Patients Visited',
    value: 9,
    color: '#38a169',
  },
];

export default function OverviewCards() {
  return (
    <div className="overview-cards">
      {metrics.map((m) => (
        <div className="card" key={m.label} style={{ borderTop: `4px solid ${m.color}` }}>
          <div className="card-value">{m.value}</div>
          <div className="card-label">{m.label}</div>
        </div>
      ))}
    </div>
  );
} 