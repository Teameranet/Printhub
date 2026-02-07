import { useState } from 'react';
import './admin.css';

const Admin = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="admin-content">
            <h2>Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">0</p>
              </div>
              <div className="stat-card">
                <h3>Active Sessions</h3>
                <p className="stat-number">0</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-number">$0</p>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p className="stat-number">0</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="admin-content">
            <h2>User Management</h2>
            <p>User management interface coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="admin-content">
            <h2>Settings</h2>
            <p>Settings interface coming soon...</p>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>Admin Panel</h1>
          <p className="admin-user">{user?.name || user?.email}</p>
        </div>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          <button
            className="nav-item logout-btn"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;