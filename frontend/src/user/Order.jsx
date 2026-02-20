import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { adminAPI, userAPI, orderAPI } from '../lib/api';
import './Order.css';

const Order = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Order Configuration State
  const [orderConfig, setOrderConfig] = useState({
    colorType: 'B&W', // B&W or Color
    sideType: 'Single', // Single or Double
    pageCount: 10,
    bindingType: '', // Will be populated from backend
    quantity: 1
  });

  // Pricing Data
  const [printingPrices, setPrintingPrices] = useState([]);
  const [bindingTypes, setBindingTypes] = useState([]);
  const [bindingPrices, setBindingPrices] = useState([]);
  const [userType, setUserType] = useState('regular'); // student, institute, regular

  // Calculated Price
  const [calculatedPrice, setCalculatedPrice] = useState({
    printingPrice: 0,
    bindingPrice: 0,
    totalPerCopy: 0,
    totalPrice: 0
  });
  const [files, setFiles] = useState([]);

  // Load user profile and pricing data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load user profile to get user type
      const userProfile = await userAPI.getProfile();
      if (userProfile.success && userProfile.data) {
        setUserType(userProfile.data.userType || 'regular');
      }

      // Load printing prices
      const printingRes = await adminAPI.getPrintingPrices();
      if (printingRes.success && printingRes.data) {
        setPrintingPrices(printingRes.data);
      }

      // Load binding types
      const typesRes = await adminAPI.getBindingTypes();
      if (typesRes.success && typesRes.data && typesRes.data.length > 0) {
        setBindingTypes(typesRes.data);
        setOrderConfig(prev => ({ ...prev, bindingType: typesRes.data[0]._id }));
      }

      // Load binding prices
      const bindingRes = await adminAPI.getBindingPrices();
      if (bindingRes.success && bindingRes.data) {
        setBindingPrices(bindingRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load pricing data' });
    }
    setIsLoading(false);
  };

  // Calculate price whenever config changes
  useEffect(() => {
    calculatePrice();
  }, [orderConfig, userType, printingPrices, bindingPrices]);

  const calculatePrice = () => {
    let printingPrice = 0;
    let bindingPrice = 0;

    // Find matching printing price rule
    const matchingPrinting = printingPrices.find(p =>
      p.colorType === orderConfig.colorType &&
      p.sideType === orderConfig.sideType &&
      p.pageRangeStart <= orderConfig.pageCount &&
      p.pageRangeEnd >= orderConfig.pageCount &&
      p.isActive
    );

    if (matchingPrinting) {
      const priceKey = userType === 'student' ? 'studentPrice'
        : userType === 'institute' ? 'institutePrice'
          : 'regularPrice';
      printingPrice = matchingPrinting[priceKey] * orderConfig.pageCount || 0;
    }

    // Find matching binding price rule if binding type selected
    if (orderConfig.bindingType) {
      const matchingBinding = bindingPrices.find(p =>
        p.bindingType?._id === orderConfig.bindingType &&
        p.pageRangeStart <= orderConfig.pageCount &&
        p.pageRangeEnd >= orderConfig.pageCount &&
        p.isActive
      );

      if (matchingBinding) {
        const priceKey = userType === 'student' ? 'studentPrice'
          : userType === 'institute' ? 'institutePrice'
            : 'regularPrice';
        bindingPrice = matchingBinding[priceKey] || 0;
      }
    }

    const totalPerCopy = printingPrice + bindingPrice;
    const totalPrice = totalPerCopy * orderConfig.quantity;

    setCalculatedPrice({
      printingPrice,
      bindingPrice,
      totalPerCopy,
      totalPrice
    });
  };

  const handleConfigChange = (field, value) => {
    setOrderConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, orderConfig.quantity + delta);
    handleConfigChange('quantity', newQuantity);
  };

  const handlePlaceOrder = async () => {
    if (!orderConfig.bindingType) {
      setMessage({ type: 'error', text: 'Please select a binding type' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setIsLoading(true);

      // If files selected, send multipart/form-data
      let response;
      if (files && files.length > 0) {
        const form = new FormData();
        form.append('colorType', orderConfig.colorType);
        form.append('sideType', orderConfig.sideType);
        form.append('pageCount', orderConfig.pageCount);
        form.append('bindingType', orderConfig.bindingType);
        form.append('quantity', orderConfig.quantity);
        form.append('totalPrice', calculatedPrice.totalPrice);
        form.append('notes', 'Placed from frontend');
        // items as JSON string
        form.append('items', JSON.stringify([
          { type: 'printing', pricePerUnit: calculatedPrice.printingPrice },
          { type: 'binding', pricePerUnit: calculatedPrice.bindingPrice }
        ]));
        files.forEach((f) => {
          form.append('files', f);
        });

        response = await orderAPI.createOrder(form);
      } else {
        const orderData = {
          colorType: orderConfig.colorType,
          sideType: orderConfig.sideType,
          pageCount: orderConfig.pageCount,
          bindingType: orderConfig.bindingType,
          quantity: orderConfig.quantity,
          totalPrice: calculatedPrice.totalPrice,
          status: 'pending',
          items: [
            {
              type: 'printing',
              pricePerUnit: calculatedPrice.printingPrice
            },
            {
              type: 'binding',
              pricePerUnit: calculatedPrice.bindingPrice
            }
          ]
        };

        response = await orderAPI.createOrder(orderData);
      }

      if (response.success) {
        setMessage({ type: 'success', text: 'Order placed successfully!' });
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to place order' });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage({ type: 'error', text: 'Failed to place order. Please try again.' });
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (isLoading && printingPrices.length === 0) {
    return (
      <div className="order-loading">
        <Loader size={48} className="spinner" />
        <p>Loading order pricing...</p>
      </div>
    );
  }

  return (
    <div className="order-container">
      <div className="order-header">
        <h1>Place Your Order</h1>
        <p>Configure your print job and see real-time pricing</p>
      </div>

      {message.text && (
        <div className={`order-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div className="order-wrapper">
        {/* Configuration Section */}
        <div className="order-config-section">
          <h2>Printing Configuration</h2>

          <div className="config-grid">
            {/* Color Type Selection */}
            <div className="config-group">
              <label>Color Type</label>
              <div className="radio-group">
                {['B&W', 'Color'].map(type => (
                  <label key={type} className="radio-option">
                    <input
                      type="radio"
                      name="colorType"
                      value={type}
                      checked={orderConfig.colorType === type}
                      onChange={(e) => handleConfigChange('colorType', e.target.value)}
                      disabled={isLoading}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Side Type Selection */}
            <div className="config-group">
              <label>Sides</label>
              <div className="radio-group">
                {['Single', 'Double'].map(type => (
                  <label key={type} className="radio-option">
                    <input
                      type="radio"
                      name="sideType"
                      value={type}
                      checked={orderConfig.sideType === type}
                      onChange={(e) => handleConfigChange('sideType', e.target.value)}
                      disabled={isLoading}
                    />
                    <span>{type} Sided</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Page Count */}
            <div className="config-group full-width">
              <label>Number of Pages</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={orderConfig.pageCount}
                onChange={(e) => handleConfigChange('pageCount', parseInt(e.target.value) || 1)}
                className="page-input"
                disabled={isLoading}
              />
            </div>

            {/* Binding Type Selection */}
            <div className="config-group full-width">
              <label>Binding Type</label>
              <select
                value={orderConfig.bindingType}
                onChange={(e) => handleConfigChange('bindingType', e.target.value)}
                className="binding-select"
                disabled={isLoading}
              >
                <option value="">Select a binding type...</option>
                {bindingTypes.map(type => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="config-group full-width">
              <label>Upload File(s)</label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFiles(Array.from(e.target.files))}
                disabled={isLoading}
              />
              {files && files.length > 0 && (
                <small>{files.length} file(s) selected</small>
              )}
            </div>

            {/* Quantity Selection */}
            <div className="config-group full-width quantity-group">
              <label>Quantity (Sets)</label>
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={orderConfig.quantity <= 1 || isLoading}
                >
                  <Minus size={18} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={orderConfig.quantity}
                  onChange={(e) => handleConfigChange('quantity', Math.max(1, parseInt(e.target.value) || 1))}
                  className="qty-input"
                  disabled={isLoading}
                />
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isLoading}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Price Breakdown Section */}
        <div className="order-price-section">
          <h2>Price Breakdown</h2>

          <div className="price-breakdown">
            <div className="price-row">
              <span className="price-label">Printing (per page)</span>
              <span className="price-value">₹{calculatedPrice.printingPrice.toFixed(2)}</span>
            </div>

            <div className="price-row">
              <span className="price-label">Binding</span>
              <span className="price-value">₹{calculatedPrice.bindingPrice.toFixed(2)}</span>
            </div>

            <div className="price-divider"></div>

            <div className="price-row total-per-copy">
              <span className="price-label">Per Copy</span>
              <span className="price-value">₹{calculatedPrice.totalPerCopy.toFixed(2)}</span>
            </div>

            <div className="price-row quantity-total">
              <span className="price-label">
                {orderConfig.quantity} × ₹{calculatedPrice.totalPerCopy.toFixed(2)}
              </span>
              <span className="price-value">₹{calculatedPrice.totalPrice.toFixed(2)}</span>
            </div>

            <div className="price-divider"></div>

            <div className="price-row grand-total">
              <span className="price-label">Total Price</span>
              <span className="price-value">₹{calculatedPrice.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="user-type-info">
            <small>Pricing tier: <strong>{userType.charAt(0).toUpperCase() + userType.slice(1)}</strong></small>
          </div>

          <button
            className={`btn-place-order ${isLoading ? 'loading' : ''}`}
            onClick={handlePlaceOrder}
            disabled={isLoading || !orderConfig.bindingType}
          >
            {isLoading ? (
              <>
                <Loader size={18} className="spinner-small" />
                Placing order...
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Place Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
