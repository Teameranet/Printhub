import React from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const OrdersOverview = () => {
  const orderStats = [
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12%',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Orders',
      value: '45',
      change: '+5%',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed Orders',
      value: '1,156',
      change: '+8%',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Cancelled Orders',
      value: '33',
      change: '-2%',
      icon: XCircle,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Overview</h1>
        <p className="text-gray-600 mt-2">Monitor and manage all customer orders</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {orderStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Table Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Orders management interface will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersOverview;