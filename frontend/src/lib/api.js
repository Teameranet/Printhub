// API utility functions for making HTTP requests

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth headers
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(options.auth),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Could not connect to the server. Please ensure the backend is running on http://localhost:5000');
    }
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
      auth: true,
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/api/auth/me', {
      method: 'GET',
      auth: true,
    });
  },
};

// User API calls
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/api/users/profile', {
      method: 'GET',
      auth: true,
    });
  },

  updateProfile: async (userData) => {
    return apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
      auth: true,
    });
  },

  getMyOrders: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/api/orders${qs ? `?${qs}` : ''}`, {
      method: 'GET',
      auth: true,
    });
  },

  getOrderById: async (orderId) => {
    return apiRequest(`/api/orders/${orderId}`, {
      method: 'GET',
      auth: true,
    });
  },

  getGuestOrderById: async (orderId, phone) => {
    const qs = new URLSearchParams({ phone: String(phone).trim() }).toString();
    return apiRequest(`/api/orders/guest/${orderId}?${qs}`, {
      method: 'GET',
      auth: false,
    });
  },

  // Admin: get all users (admin only)
  getAllUsers: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const endpoint = `/api/users${qs ? `?${qs}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
      auth: true,
    });
  },
};

// Employee API calls (view orders, update status only)
export const employeeAPI = {
  getOrders: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/api/employee/orders${qs ? `?${qs}` : ''}`, {
      method: 'GET',
      auth: true,
    });
  },
  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/api/employee/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      auth: true,
    });
  },
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: async () => {
    return apiRequest('/api/admin/dashboard/stats', {
      method: 'GET',
      auth: true,
    });
  },

  getOrders: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const endpoint = `/api/admin/orders${qs ? `?${qs}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
      auth: true,
    });
  },
  // Printing pricing management
  getPrintingPrices: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const endpoint = `/api/pricing${qs ? `?${qs}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
      auth: false,
    });
  },

  checkExistingPrice: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const endpoint = `/api/pricing/check/existing${qs ? `?${qs}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
      auth: false,
    });
  },

  createPrintingPrice: async (priceData) => {
    return apiRequest('/api/pricing', {
      method: 'POST',
      body: JSON.stringify(priceData),
      auth: true,
    });
  },

  updatePrintingPrice: async (id, updates) => {
    return apiRequest(`/api/pricing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      auth: true,
    });
  },

  deletePrintingPrice: async (id) => {
    return apiRequest(`/api/pricing/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  bulkCreatePrintingPrices: async (rules) => {
    return apiRequest('/api/pricing/bulk/create', {
      method: 'POST',
      body: JSON.stringify({ rules }),
      auth: true,
    });
  },

  initializeDefaultPrices: async () => {
    return apiRequest('/api/pricing/init/defaults', {
      method: 'POST',
      auth: true,
    });
  },

  // Binding Types and Prices
  getBindingTypes: async () => {
    return apiRequest('/api/binding/types', {
      method: 'GET',
      auth: false,
    });
  },

  createBindingType: async (typeData) => {
    return apiRequest('/api/binding/types', {
      method: 'POST',
      body: JSON.stringify(typeData),
      auth: true,
    });
  },

  updateBindingType: async (id, updates) => {
    return apiRequest(`/api/binding/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      auth: true,
    });
  },

  deleteBindingType: async (id) => {
    return apiRequest(`/api/binding/types/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  getBindingPrices: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const endpoint = `/api/binding/prices${qs ? `?${qs}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
      auth: false,
    });
  },

  createBindingPrice: async (priceData) => {
    return apiRequest('/api/binding/prices', {
      method: 'POST',
      body: JSON.stringify(priceData),
      auth: true,
    });
  },

  updateBindingPrice: async (id, updates) => {
    return apiRequest(`/api/binding/prices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      auth: true,
    });
  },

  deleteBindingPrice: async (id) => {
    return apiRequest(`/api/binding/prices/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  bulkCreateBindingPrices: async (rules) => {
    return apiRequest('/api/binding/prices-bulk', {
      method: 'POST',
      body: JSON.stringify({ rules }),
      auth: true,
    });
  },

};

// Order API calls (User side)
export const orderAPI = {
  createOrder: async (orderData) => {
    const url = `${API_URL}/api/orders`;
    // If FormData is provided (with files), send multipart request
    if (orderData instanceof FormData) {
      const token = getAuthToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: orderData,
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Failed to create order');
      return data;
    }

    return apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      auth: true,
    });
  },

  getOrders: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const endpoint = `/api/orders${qs ? `?${qs}` : ''}`;
    return apiRequest(endpoint, {
      method: 'GET',
      auth: true,
    });
  },

  getOrderById: async (orderId) => {
    return apiRequest(`/api/orders/${orderId}`, {
      method: 'GET',
      auth: true,
    });
  },

  updateOrder: async (orderId, updates) => {
    return apiRequest(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      auth: true,
    });
  },

  calculateOrderPrice: async (config) => {
    const qs = new URLSearchParams(config).toString();
    return apiRequest(`/api/orders/calculate/price?${qs}`, {
      method: 'GET',
      auth: false,
    });
  }
};

// Payment API calls
export const paymentAPI = {
  createRazorpayOrder: async (orderData) => {
    return apiRequest('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
      auth: false, // Can be used by guests too
    });
  },

  verifyPayment: async (verificationData) => {
    return apiRequest('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
      auth: false, // Can be used by guests too
    });
  },
};

export default apiRequest;