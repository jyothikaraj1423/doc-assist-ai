import React, { useState } from 'react';
import './Orders.css';

export default function Orders({ userRole }) {
  const [orders, setOrders] = useState([
    {
      id: 1,
      type: 'Lab Order',
      patient: 'John Smith',
      order: 'CBC (Complete Blood Count)',
      status: 'pending',
      timestamp: '2024-01-15 14:30',
      source: 'Voice Command',
      priority: 'routine',
      details: 'Complete blood count to check for anemia and infection markers'
    },
    {
      id: 2,
      type: 'Medication',
      patient: 'Sarah Johnson',
      order: 'Metformin 500mg BID',
      status: 'active',
      timestamp: '2024-01-15 13:45',
      source: 'Voice Command',
      priority: 'high',
      details: 'Diabetes management medication'
    },
    {
      id: 3,
      type: 'Imaging',
      patient: 'Mike Wilson',
      order: 'Chest X-Ray',
      status: 'completed',
      timestamp: '2024-01-15 12:20',
      source: 'Manual Entry',
      priority: 'urgent',
      details: 'Chest X-ray to rule out pneumonia'
    },
    {
      id: 4,
      type: 'Consultation',
      patient: 'Lisa Brown',
      order: 'Cardiology Consultation',
      status: 'scheduled',
      timestamp: '2024-01-15 11:15',
      source: 'Voice Command',
      priority: 'routine',
      details: 'Referral to cardiologist for chest pain evaluation'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesType = filterType === 'all' || order.type.toLowerCase().includes(filterType);
    return matchesStatus && matchesType;
  });

  const addOrder = (newOrder) => {
    const order = {
      id: Date.now(),
      ...newOrder,
      timestamp: new Date().toLocaleString(),
      source: isVoiceMode ? 'Voice Command' : 'Manual Entry'
    };
    setOrders([order, ...orders]);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    let newOrder = {};

    if (lowerCommand.includes('order') && lowerCommand.includes('cbc')) {
      newOrder = {
        type: 'Lab Order',
        patient: 'Current Patient',
        order: 'CBC (Complete Blood Count)',
        status: 'pending',
        priority: 'routine',
        details: 'Complete blood count ordered via voice command'
      };
    } else if (lowerCommand.includes('prescribe') && lowerCommand.includes('metformin')) {
      newOrder = {
        type: 'Medication',
        patient: 'Current Patient',
        order: 'Metformin 500mg BID',
        status: 'pending',
        priority: 'high',
        details: 'Diabetes medication prescribed via voice command'
      };
    } else if (lowerCommand.includes('x-ray') || lowerCommand.includes('xray')) {
      newOrder = {
        type: 'Imaging',
        patient: 'Current Patient',
        order: 'Chest X-Ray',
        status: 'pending',
        priority: 'routine',
        details: 'Chest X-ray ordered via voice command'
      };
    }

    if (Object.keys(newOrder).length > 0) {
      addOrder(newOrder);
      setVoiceCommand('');
      return true;
    }
    return false;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#d69e2e';
      case 'active': return '#3182ce';
      case 'completed': return '#38a169';
      case 'scheduled': return '#805ad5';
      case 'cancelled': return '#e53e3e';
      default: return '#718096';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '⚠️';
      case 'routine': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-content">
        {/* Header */}
        <div className="orders-header">
          <h2>📋 Medical Orders</h2>
          <p>Manage orders with voice commands and real-time tracking</p>
        </div>

        {/* Voice Command Section */}
        <div className="voice-command-section">
          <div className="voice-toggle">
            <button
              className={`voice-btn ${isVoiceMode ? 'active' : ''}`}
              onClick={() => setIsVoiceMode(!isVoiceMode)}
            >
              🎤 {isVoiceMode ? 'Voice Mode Active' : 'Enable Voice Commands'}
            </button>
          </div>
          
          {isVoiceMode && (
            <div className="voice-input">
              <input
                type="text"
                placeholder="Try: 'Order CBC' or 'Prescribe metformin'..."
                value={voiceCommand}
                onChange={(e) => setVoiceCommand(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    processVoiceCommand(voiceCommand);
                  }
                }}
                className="voice-command-input"
              />
              <button
                className="process-btn"
                onClick={() => processVoiceCommand(voiceCommand)}
              >
                Process
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Order Templates</h3>
          <div className="template-grid">
            <button
              className="template-btn"
              onClick={() => addOrder({
                type: 'Lab Order',
                patient: 'Current Patient',
                order: 'CBC (Complete Blood Count)',
                status: 'pending',
                priority: 'routine',
                details: 'Complete blood count'
              })}
            >
              🩸 CBC
            </button>
            <button
              className="template-btn"
              onClick={() => addOrder({
                type: 'Lab Order',
                patient: 'Current Patient',
                order: 'CMP (Comprehensive Metabolic Panel)',
                status: 'pending',
                priority: 'routine',
                details: 'Comprehensive metabolic panel'
              })}
            >
              🧪 CMP
            </button>
            <button
              className="template-btn"
              onClick={() => addOrder({
                type: 'Medication',
                patient: 'Current Patient',
                order: 'Metformin 500mg BID',
                status: 'pending',
                priority: 'high',
                details: 'Diabetes medication'
              })}
            >
              💊 Metformin
            </button>
            <button
              className="template-btn"
              onClick={() => addOrder({
                type: 'Imaging',
                patient: 'Current Patient',
                order: 'Chest X-Ray',
                status: 'pending',
                priority: 'routine',
                details: 'Chest X-ray'
              })}
            >
              📷 Chest X-Ray
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="lab">Lab Orders</option>
              <option value="medication">Medications</option>
              <option value="imaging">Imaging</option>
              <option value="consultation">Consultations</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className={`order-card ${order.status}`}>
              <div className="order-header">
                <div className="order-type">
                  <span className="order-icon">{getPriorityIcon(order.priority)}</span>
                  <span className="order-title">{order.type}</span>
                </div>
                <div className="order-meta">
                  <span className="order-patient">{order.patient}</span>
                  <span className="order-time">{order.timestamp}</span>
                </div>
              </div>
              
              <div className="order-content">
                <h4>{order.order}</h4>
                <p>{order.details}</p>
              </div>
              
              <div className="order-footer">
                <div className="order-source">
                  <span className="source-label">Source:</span>
                  <span className="source-value">{order.source}</span>
                </div>
                
                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="status-select"
                    style={{ borderColor: getStatusColor(order.status) }}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <div className="no-orders-icon">📋</div>
            <h3>No orders found</h3>
            <p>No orders match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
} 