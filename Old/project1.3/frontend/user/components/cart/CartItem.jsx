import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start space-x-4">
        <img
          src={item.thumbnail}
          alt={item.document}
          className="w-16 h-16 object-cover rounded"
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{item.type}</h3>
              <p className="text-sm text-gray-600">Order ID: {item.orderId}</p>
            </div>
            <button className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            <div>Document: {item.document}</div>
            <div>Paper Size: {item.paperSize}</div>
            <div>Color: {item.color}</div>
            <div>Side: {item.side}</div>
            <div>Binding: {item.binding}</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="p-1 border rounded">
                <Minus size={16} />
              </button>
              <span className="px-3 py-1 border rounded">{item.copies}</span>
              <button className="p-1 border rounded">
                <Plus size={16} />
              </button>
            </div>
            <div className="font-semibold">₹{item.price.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;