const Pricing = require('../models/Pricing');
const SystemSettings = require('../models/SystemSettings');
const User = require('../models/User');
const Order = require('../models/Order');
const fs = require('fs');
const path = require('path');

// ===== PRICING MANAGEMENT =====

// Get all pricing
const getAllPricing = async (req, res) => {
  try {
    const pricing = await Pricing.find({ isActive: true })
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: pricing,
      count: pricing.length
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get pricing by type
const getPricingByType = async (req, res) => {
  try {
    const { serviceType } = req.params;

    const pricing = await Pricing.findOne({ serviceType, isActive: true })
      .populate('createdBy', 'name email');

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error('Get pricing by type error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create or update pricing
const setPricing = async (req, res) => {
  try {
    const { serviceType, basePrice, pricePerUnit, description } = req.body;

    // Validation
    if (!serviceType || basePrice === undefined || pricePerUnit === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceType, basePrice, and pricePerUnit'
      });
    }

    // Check if pricing exists
    let pricing = await Pricing.findOne({ serviceType });

    if (pricing) {
      // Update existing pricing
      pricing.basePrice = basePrice;
      pricing.pricePerUnit = pricePerUnit;
      if (description) pricing.description = description;
      pricing.updatedAt = Date.now();
    } else {
      // Create new pricing
      pricing = new Pricing({
        serviceType,
        basePrice,
        pricePerUnit,
        description,
        createdBy: req.user.id
      });
    }

    await pricing.save();

    res.status(200).json({
      success: true,
      message: pricing._id ? 'Pricing updated successfully' : 'Pricing created successfully',
      data: pricing
    });
  } catch (error) {
    console.error('Set pricing error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete pricing (soft delete)
const deletePricing = async (req, res) => {
  try {
    const { id } = req.params;

    const pricing = await Pricing.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!pricing) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing deleted successfully',
      data: pricing
    });
  } catch (error) {
    console.error('Delete pricing error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== SYSTEM SETTINGS MANAGEMENT =====

// Get all system settings
const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.find();

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get specific setting
const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await SystemSettings.findOne({ key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update system setting
const updateSystemSetting = async (req, res) => {
  try {
    const { key, value, description } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide key and value'
      });
    }

    let setting = await SystemSettings.findOne({ key });

    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
      setting.updatedAt = Date.now();
    } else {
      setting = new SystemSettings({
        key,
        value,
        description
      });
    }

    await setting.save();

    res.status(200).json({
      success: true,
      message: 'Setting updated successfully',
      data: setting
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// ===== ADMIN DASHBOARD STATS =====

// Get admin dashboard statistics (includes order stats)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPricing = await Pricing.countDocuments({ isActive: true });
    const settings = await SystemSettings.find();

    // Order statistics (active orders only)
    // Support legacy orders without isActive field by checking for { $ne: false }
    const activeQuery = { isActive: { $ne: false } };

    const totalOrders = await Order.countDocuments(activeQuery);
    const pendingOrders = await Order.countDocuments({ status: 'pending', ...activeQuery });
    const processingOrders = await Order.countDocuments({ status: 'processing', ...activeQuery });
    const completedOrders = await Order.countDocuments({ status: 'completed', ...activeQuery });
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid', ...activeQuery } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPricingTypes: totalPricing,
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue,
        systemSettings: settings,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10) || 50;

    // Use same query as stats for consistency
    const activeQuery = { isActive: { $ne: false } };
    const total = await Order.countDocuments(activeQuery);

    const orders = await Order.find(activeQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email phone userType')
      .populate('bindingType', 'name')
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    console.error('Get all orders (admin) error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  // Pricing
  getAllPricing,
  getPricingByType,
  setPricing,
  deletePricing,
  // System Settings
  getSystemSettings,
  getSettingByKey,
  updateSystemSetting,
  // Dashboard
  getDashboardStats
  ,
  // Admin orders
  getAllOrders
};
