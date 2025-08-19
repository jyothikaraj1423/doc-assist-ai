import React from 'react';
import './Appointments.css';

const appointments = [
  { id: 1, patient: 'John Smith', time: '9:00 AM', type: 'Follow-up', status: 'Confirmed' },
  { id: 2, patient: 'Sarah Johnson', time: '10:30 AM', type: 'New Patient', status: 'Confirmed' },
  { id: 3, patient: 'Mike Davis', time: '11:45 AM', type: 'Consultation', status: 'Pending' },
  { id: 4, patient: 'Emily Wilson', time: '2:00 PM', type: 'Follow-up', status: 'Confirmed' },
  { id: 5, patient: 'David Brown', time: '3:15 PM', type: 'Emergency', status: 'Confirmed' },
];

export default function Appointments() {
  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2>Today's Appointments</h2>
        <button className="add-appointment-btn">+ New Appointment</button>
      </div>
      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.time}</td>
                <td>{appointment.patient}</td>
                <td>{appointment.type}</td>
                <td>
                  <span className={`status ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 