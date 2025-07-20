import React from 'react';
import './LabReports.css';

const labReports = [
  { id: 1, patient: 'John Smith', test: 'Blood Panel', date: '2024-01-15', status: 'Completed', result: 'Normal' },
  { id: 2, patient: 'Sarah Johnson', test: 'HbA1c', date: '2024-01-10', status: 'Pending', result: 'Awaiting' },
  { id: 3, patient: 'Mike Davis', test: 'Chest X-Ray', date: '2024-01-08', status: 'Completed', result: 'Normal' },
  { id: 4, patient: 'Emily Wilson', test: 'Lipid Panel', date: '2024-01-12', status: 'In Progress', result: 'Processing' },
];

export default function LabReports() {
  return (
    <div className="lab-reports-container">
      <div className="lab-reports-header">
        <h2>Lab Reports</h2>
        <button className="request-lab-btn">+ Request Lab Test</button>
      </div>
      <div className="lab-reports-table">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test</th>
              <th>Date</th>
              <th>Status</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {labReports.map(report => (
              <tr key={report.id}>
                <td>{report.patient}</td>
                <td>{report.test}</td>
                <td>{report.date}</td>
                <td>
                  <span className={`status ${report.status.toLowerCase().replace(' ', '-')}`}>
                    {report.status}
                  </span>
                </td>
                <td>{report.result}</td>
                <td>
                  <button className="view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 