import React from 'react';
import CartHeader from '../components/cart/CartHeader';
import CartItem from '../components/cart/CartItem';

const Cart = () => {
  const cartItems = [
    {
      type: 'Xerox',
      orderId: '1234567890',
      price: 1.50,
      document: 'Marksheet.png',
      paperSize: 'A4',
      color: 'Black & White',
      copies: 5,
      side: 'One Side',
      binding: 'Loose Paper',
      thumbnail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=100'
    },
    {
      type: 'Xerox',
      orderId: '9876543210',
      price: 50.46,
      document: 'Certificate.pdf',
      paperSize: 'A4',
      color: 'Multicolor',
      copies: 5,
      side: 'Both Side',
      binding: 'Loose Paper',
      thumbnail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <CartHeader />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">Cart ({cartItems.length} items)</h1>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.orderId} item={item} />
          ))}
        </div>
        
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Delivery Charges</span>
            <span>₹0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-4">
            <span>Total</span>
            <span>₹{cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
          </div>
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg mt-4 font-semibold">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;