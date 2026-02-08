import React, { useState } from 'react';
import { Shield, Activity, DollarSign, Settings as SettingsIcon } from 'lucide-react';
import PricingManagement from './PricingManagement';
import './Settings.css';

const Settings = ({ user }) => {
    const [activeTab, setActiveTab] = useState('pricing');

    return (
        <div className="management-content">
            <div className="management-header">
                <div className="header-title">
                    <h1>Settings</h1>
                    <p>Configure admin panel preferences and pricing</p>
                </div>
            </div>

            <div className="settings-tabs">
                <button
                    className={`settings-tab ${activeTab === 'pricing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pricing')}
                >
                    <DollarSign size={18} />
                    Pricing
                </button>
                <button
                    className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    <SettingsIcon size={18} />
                    General
                </button>
            </div>

            {activeTab === 'pricing' && <PricingManagement />}

            {activeTab === 'general' && (
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
            )}
        </div>
    );
};

export default Settings;
