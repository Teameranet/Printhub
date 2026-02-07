import React, { useState } from 'react';
import { X, Search, Package, Truck, CheckCircle, User, Phone, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrackOrderModal = ({ isOpen, onClose }: TrackOrderModalProps) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleTrack = () => {
    // Mock tracking data with comprehensive order information
    if (orderNumber) {
      setTrackingResult({
        orderNumber: orderNumber,
        status: 'In Transit',
        estimatedDelivery: '2024-01-20',
        orderDate: '2024-01-15',
        totalAmount: '₹1,299.00',
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        
        // Customer Information
        customer: {
          name: 'Ashwin Chavan',
          phone: '+91 8809994970',
          email: 'chavanashwin23@gmail.com'
        },
        
        // Pickup Information
        pickupInfo: {
          location: 'Branch 1 - Print Hub Store',
          address: 'No.152. Near MIT Art Comm Sci college Alandi Pune - 412105',
          contactPerson: 'Store Manager',
          contactPhone: '+91 9876543210'
        },
        
        // Order Items
        items: [
          {
            id: 1,
            name: 'Business Cards',
            quantity: 500,
            specifications: 'Premium Matte Finish, 350 GSM',
            price: '₹899.00'
          },
          {
            id: 2,
            name: 'Letterhead',
            quantity: 100,
            specifications: 'A4 Size, 120 GSM Bond Paper',
            price: '₹400.00'
          }
        ],
        
        // Tracking Steps
        steps: [
          { 
            status: 'Order Placed', 
            completed: true, 
            date: '2024-01-15',
            time: '10:30 AM',
            description: 'Order confirmed and payment received'
          },
          { 
            status: 'Processing', 
            completed: true, 
            date: '2024-01-16',
            time: '2:15 PM',
            description: 'Order is being prepared for printing'
          },
          { 
            status: 'Printed', 
            completed: true, 
            date: '2024-01-17',
            time: '11:45 AM',
            description: 'Items have been printed and quality checked'
          },
          { 
            status: 'Ready for Pickup', 
            completed: true, 
            date: '2024-01-18',
            time: '9:20 AM',
            description: 'Order is ready for pickup at the store'
          },
          { 
            status: 'Out for Delivery', 
            completed: false, 
            date: '2024-01-20',
            time: 'Expected',
            description: 'Order will be out for delivery'
          },
          { 
            status: 'Delivered', 
            completed: false, 
            date: '',
            time: '',
            description: 'Order delivered to customer'
          }
        ]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg w-full relative flex flex-col overflow-hidden ${
        trackingResult ? 'max-w-4xl max-h-[90vh]' : 'max-w-[448px] h-[241.6px]'
      }`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Track Your Order</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your order number"
                />
              </div>
            </div>
            
            <button
              onClick={handleTrack}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              Track Order
            </button>
          </div>
        </div>

        {trackingResult && (
          <div className="flex-grow overflow-y-auto px-8 pb-8 min-h-0">
            <div className="border-t pt-6">
              {/* Order Header */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{trackingResult.orderNumber}</h3>
                    <p className="text-sm text-gray-600">Placed on {trackingResult.orderDate}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      trackingResult.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      trackingResult.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      trackingResult.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trackingResult.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2 text-purple-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium w-16">Name:</span>
                        <span className="text-gray-600">{trackingResult.customer.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{trackingResult.customer.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{trackingResult.customer.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Information */}
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                      Pick-Up Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">{trackingResult.pickupInfo.location}</span>
                      </div>
                      <div className="text-gray-600">
                        {trackingResult.pickupInfo.address}
                      </div>
                      <div className="flex items-center pt-2">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{trackingResult.pickupInfo.contactPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-purple-600" />
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {trackingResult.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-xs text-gray-500">{item.specifications}</p>
                          </div>
                          <p className="font-medium text-sm">{item.price}</p>
                        </div>
                      ))}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total Amount</span>
                          <span className="text-purple-600">{trackingResult.totalAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                          <span>Payment Status</span>
                          <span className="text-green-600 font-medium">{trackingResult.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-purple-600" />
                    Order Timeline
                  </h4>
                  <div className="relative pl-8">
                    {trackingResult.steps.map((step: any, index: number) => (
                      <div key={index} className="mb-6 last:mb-0">
                        <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>
                        <div className={`absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full -ml-3 ${
                          step.completed ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step.completed ? <CheckCircle size={14} /> : <span className="text-xs">{index + 1}</span>}
                        </div>
                        <div className="relative pl-4">
                          <p className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.status}
                          </p>
                          <p className="text-sm text-gray-600">
                            {step.date} {step.time !== '' ? `at ${step.time}` : ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Estimated Delivery */}
                  {trackingResult.estimatedDelivery && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Estimated Delivery: {trackingResult.estimatedDelivery}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderModal;