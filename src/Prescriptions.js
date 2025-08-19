import React from 'react';
import './Prescriptions.css';

const prescriptions = [
  { id: 1, patient: 'John Smith', medication: 'Lisinopril 10mg', dosage: 'Once daily', status: 'Active', refills: 2 },
  { id: 2, patient: 'Sarah Johnson', medication: 'Metformin 500mg', dosage: 'Twice daily', status: 'Active', refills: 1 },
  { id: 3, patient: 'Mike Davis', medication: 'Albuterol Inhaler', dosage: 'As needed', status: 'Active', refills: 3 },
];

export default function Prescriptions() {
  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Prescriptions</h2>
        <button className="add-prescription-btn">+ New Prescription</button>
      </div>
      <div className="prescriptions-grid">
        {prescriptions.map(prescription => (
          <div key={prescription.id} className="prescription-card">
            <div className="prescription-header">
              <h3>{prescription.patient}</h3>
              <span className="status-active">{prescription.status}</span>
            </div>
            <div className="prescription-details">
              <p><strong>Medication:</strong> {prescription.medication}</p>
              <p><strong>Dosage:</strong> {prescription.dosage}</p>
              <p><strong>Refills:</strong> {prescription.refills}</p>
            </div>
            <div className="prescription-actions">
              <button className="refill-btn">Refill</button>
              <button className="edit-btn">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 