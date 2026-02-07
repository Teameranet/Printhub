import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardHome from './DashboardHome';
import UserManagement from './users/UserManagement';
import OrdersOverview from './orders/OrdersOverview';
import ProductsOverview from './products/ProductsOverview';
import ServiceManagement from './services/ServiceManagement';
import MarketingOverview from './marketing/MarketingOverview';
import DeliveryOverview from './delivery/DeliveryOverview';
import PaymentsOverview from './payments/PaymentsOverview';
import ReportsOverview from './reports/ReportsOverview';
import SettingsOverview from './settings/SettingsOverview';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders/*" element={<OrdersOverview />} />
          <Route path="products/*" element={<ProductsOverview />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="marketing/*" element={<MarketingOverview />} />
          <Route path="delivery" element={<DeliveryOverview />} />
          <Route path="payments" element={<PaymentsOverview />} />
          <Route path="reports" element={<ReportsOverview />} />
          <Route path="settings" element={<SettingsOverview />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;