import React from 'react';
import { Settings, User, Bell, Shield, Globe } from 'lucide-react';

const SettingsOverview = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage system settings and configurations</p>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
          </div>
          <p className="text-gray-600 mb-4">Manage admin account and profile settings</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">Configure →</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <p className="text-gray-600 mb-4">Configure email and system notifications</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">Configure →</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          </div>
          <p className="text-gray-600 mb-4">Manage security settings and permissions</p>
          <button className="text-green-600 hover:text-green-700 font-medium">Configure →</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-6 w-6 text-orange-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
          </div>
          <p className="text-gray-600 mb-4">Configure global system preferences</p>
          <button className="text-orange-600 hover:text-orange-700 font-medium">Configure →</button>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Detailed settings interface will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverview;