import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrderDetails = () => {
  const orderData = {
    orderNumber: 'ORD-2024-001234',
    status: 'In Transit',
    estimatedDelivery: 'January 20, 2024',
    items: [
      {
        name: 'Business Cards',
        quantity: 500,
        price: 49.99
      },
      {
        name: 'Letterhead',
        quantity: 100,
        price: 29.99
      }
    ],
    timeline: [
      { status: 'Order Placed', completed: true, date: 'Jan 15, 2024 10:30 AM' },
      { status: 'Processing', completed: true, date: 'Jan 16, 2024 2:15 PM' },
      { status: 'Printed', completed: true, date: 'Jan 17, 2024 11:45 AM' },
      { status: 'Shipped', completed: true, date: 'Jan 18, 2024 9:20 AM' },
      { status: 'Out for Delivery', completed: false, date: 'Expected: Jan 20, 2024' },
      { status: 'Delivered', completed: false, date: '' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Details</h1>
        <p className="text-gray-600">Order #{orderData.orderNumber}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          <div className="space-y-4">
            {orderData.timeline.map((step, index) => (
              <div key={index} className="flex items-center">
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4" />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-4" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.status}
                  </p>
                  {step.date && (
                    <p className="text-sm text-gray-500">{step.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">${item.price}</p>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>${orderData.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p className="text-gray-600">
              John Doe<br />
              123 Main Street<br />
              Anytown, ST 12345<br />
              United States
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Estimated Delivery</h3>
            <p className="text-gray-600">{orderData.estimatedDelivery}</p>
            <div className="mt-4 flex items-center text-blue-600">
              <Truck className="w-5 h-5 mr-2" />
              <span>Track with carrier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;