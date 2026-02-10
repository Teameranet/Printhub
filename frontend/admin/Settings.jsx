import React from 'react';
import { Shield, Activity } from 'lucide-react';
import './Settings.css';

const Settings = ({ user }) => {
    return (
        <div className="management-content">
            <div className="management-header">
                <div className="header-title">
                    <h1>Settings</h1>
                    <p>Configure admin panel preferences</p>
                </div>
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <h3><Shield size={18} /> Admin Account</h3>
                    <div className="settings-item">
                        <span>Logged in as</span>
                        <span className="settings-value">{user?.name || user?.email}</span>
                    </div>
                    <div className="settings-item">
                        <span>Role</span>
                        <span className="settings-value">Administrator</span>
                    </div>
                </div>

                <div className="settings-card">
                    <h3><Activity size={18} /> System Status</h3>
                    <div className="settings-item">
                        <span>Print Queue</span>
                        <span className="settings-value status-active">Active</span>
                    </div>
                    <div className="settings-item">
                        <span>Payment Gateway</span>
                        <span className="settings-value status-active">Connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
