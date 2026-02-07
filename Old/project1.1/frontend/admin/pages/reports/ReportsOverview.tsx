import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';

const ReportsOverview = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">View detailed business insights and analytics</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
            <Download size={20} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Report</h3>
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-gray-600 mb-4">Track sales performance and revenue trends</p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">View Report →</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Analytics</h3>
            <PieChart className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-4">Analyze customer behavior and demographics</p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">View Report →</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Growth Metrics</h3>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-gray-600 mb-4">Monitor business growth and KPIs</p>
          <button className="text-green-600 hover:text-green-700 font-medium">View Report →</button>
        </div>
      </div>

      {/* Reports Dashboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Detailed analytics dashboard will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsOverview;