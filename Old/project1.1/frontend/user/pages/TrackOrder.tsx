import React from 'react';
import OrderDetails from '../components/orders/OrderDetails';
import OrderHeader from '../components/orders/OrderHeader';

const TrackOrder = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <OrderHeader />
      <div className="container mx-auto px-4 py-6">
        <OrderDetails />
      </div>
    </div>
  );
};

export default TrackOrder;