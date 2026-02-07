import React from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

const ProductsOverview = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products Overview</h1>
            <p className="text-gray-600 mt-2">Manage your product catalog</p>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
            <Plus size={20} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Grid Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Catalog</h3>
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Product management interface will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsOverview;