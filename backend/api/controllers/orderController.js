const Order = require('../models/Order');
const PrintingPrice = require('../models/PrintingPrice');
const BindingPrice = require('../models/BindingPrice');
const BindingType = require('../models/BindingType');

// Helper: build order payload (shared by createOrder and createGuestOrder)
function buildOrderPayload(body, opts) {
  const { userId, guestName, guestPhone, filesMeta } = opts;
  const colorType = body.colorType;
  const sideType = body.sideType;
  const pageCount = body.pageCount;
  const bindingType = body.bindingType;
  const quantity = body.quantity;
  const totalPrice = body.totalPrice;
  const notes = body.notes;

  const pageCountNum = parseInt(pageCount, 10) || 1;
  const quantityNum = parseInt(quantity, 10) || 1;
  const totalPriceNum = parseFloat(totalPrice) || 0;

  const payload = {
    user: userId || undefined,
    guestName: guestName ? String(guestName).trim() : undefined,
    guestPhone: guestPhone ? String(guestPhone).trim() : undefined,
    colorType: String(colorType).trim(),
    sideType: String(sideType).trim(),
    pageCount: pageCountNum,
    bindingType,
    quantity: quantityNum,
    totalPrice: totalPriceNum,
    notes: notes ? String(notes).trim() : undefined,
    status: 'pending',
    paymentStatus: body.paymentStatus === 'paid'
      ? 'paid'
      : body.paymentStatus === 'partial'
        ? 'partial'
        : 'unpaid',
    razorpayOrderId: body.razorpayOrderId ? String(body.razorpayOrderId).trim() : undefined,
    items: [
      {
        description: `${quantityNum}x ${colorType} - ${sideType} Sided - ${pageCountNum} Pages`,
        pricePerUnit: quantityNum > 0 ? totalPriceNum / quantityNum : totalPriceNum,
        quantity: quantityNum,
      },
    ],
    files: filesMeta || [],
  };
  return payload;
}

// @desc    Create a new order (authenticated user)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const body = req.body || {};
    const colorType = body.colorType;
    const sideType = body.sideType;
    const pageCount = body.pageCount;
    const bindingType = body.bindingType;
    const quantity = body.quantity;
    const totalPrice = body.totalPrice;
    const userId = req.user?.id;

    const missing = [];
    if (!colorType || colorType.trim?.() === '') missing.push('colorType');
    if (!sideType || sideType.trim?.() === '') missing.push('sideType');
    if (pageCount === undefined || pageCount === null || String(pageCount).trim() === '') missing.push('pageCount');
    if (!bindingType || bindingType.trim?.() === '') missing.push('bindingType');
    if (quantity === undefined || quantity === null || String(quantity).trim() === '') missing.push('quantity');
    if (totalPrice === undefined || totalPrice === null || String(totalPrice).trim() === '') missing.push('totalPrice');
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to place an order, or use guest checkout with your name and phone.',
      });
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: ' + missing.join(', '),
        received: { bodyKeys: Object.keys(body) },
      });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one file attachment is required for placing an order.',
      });
    }

    const bindingTypeExists = await BindingType.findById(bindingType);
    if (!bindingTypeExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid binding type selected',
      });
    }

    let filesMeta = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      filesMeta = req.files.map(f => ({
        originalName: f.originalname,
        filename: f.filename,
        mimeType: f.mimetype,
        size: f.size,
        path: `/uploads/${f.filename}`,
      }));
    }

    const order = await Order.create(buildOrderPayload(body, { userId, filesMeta }));

    await order.populate([
      { path: 'user', select: 'name email phone userType' },
      { path: 'bindingType', select: 'name' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order',
    });
  }
};

// @desc    Create order as guest (no login) — name and phone only
// @route   POST /api/orders/guest
// @access  Public
exports.createGuestOrder = async (req, res) => {
  try {
    const body = req.body || {};
    const colorType = body.colorType;
    const sideType = body.sideType;
    const pageCount = body.pageCount;
    const bindingType = body.bindingType;
    const quantity = body.quantity;
    const totalPrice = body.totalPrice;
    const notes = body.notes;
    const guestName = body.guestName || body.fullName;
    const guestPhone = body.guestPhone || body.mobile;

    const missing = [];
    if (!colorType || colorType.trim?.() === '') missing.push('colorType');
    if (!sideType || sideType.trim?.() === '') missing.push('sideType');
    if (pageCount === undefined || pageCount === null || String(pageCount).trim() === '') missing.push('pageCount');
    if (!bindingType || bindingType.trim?.() === '') missing.push('bindingType');
    if (quantity === undefined || quantity === null || String(quantity).trim() === '') missing.push('quantity');
    if (totalPrice === undefined || totalPrice === null || String(totalPrice).trim() === '') missing.push('totalPrice');
    if (!guestName || String(guestName).trim() === '') missing.push('guestName (or fullName)');
    if (!guestPhone || String(guestPhone).trim() === '') missing.push('guestPhone (or mobile)');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: ' + missing.join(', '),
      });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one file attachment is required for placing an order.',
      });
    }

    const bindingTypeExists = await BindingType.findById(bindingType);
    if (!bindingTypeExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid binding type selected',
      });
    }

    let filesMeta = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      filesMeta = req.files.map(f => ({
        originalName: f.originalname,
        filename: f.filename,
        mimeType: f.mimetype,
        size: f.size,
        path: `/uploads/${f.filename}`,
      }));
    }

    const order = await Order.create(buildOrderPayload(body, {
      guestName: String(guestName).trim(),
      guestPhone: String(guestPhone).trim(),
      filesMeta,
    }));

    await order.populate({ path: 'bindingType', select: 'name' });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully. You can track it with your phone number.',
      data: order,
    });
  } catch (error) {
    console.error('Create guest order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order',
    });
  }
};

// @desc    Get guest order by ID (public) — requires ?phone= to verify
// @route   GET /api/orders/guest/:id
// @access  Public
exports.getGuestOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const phone = req.query.phone;
    if (!phone || String(phone).trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required to view this order',
      });
    }
    const order = await Order.findById(id)
      .populate('bindingType', 'name')
      .lean();
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    if (!order.guestPhone) {
      return res.status(403).json({
        success: false,
        message: 'This order requires login to view',
      });
    }
    const normalized = String(phone).replace(/\D/g, '');
    const orderPhone = String(order.guestPhone).replace(/\D/g, '');
    if (normalized !== orderPhone) {
      return res.status(403).json({
        success: false,
        message: 'Phone number does not match this order',
      });
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get guest order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order',
    });
  }
};

// @desc    Get all orders for authenticated user
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 10, page = 1 } = req.query;

    // Build query
    // Build query (include legacy orders where isActive is missing)
    const query = { user: userId, isActive: { $ne: false } };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const total = await Order.countDocuments(query);

    // Get orders
    const orders = await Order.find(query)
      .populate('user', 'name email phone userType')
      .populate('bindingType', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders',
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id)
      .populate('user', 'name email phone userType')
      .populate('bindingType', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.user) {
      if (order.user._id.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this order',
        });
      }
    } else {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this order',
        });
      }
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order',
    });
  }
};

// @desc    Update order (status, payment status, notes)
// @route   PUT /api/orders/:id
// @access  Private
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status, paymentStatus, notes } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.user) {
      if (order.user.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this order',
        });
      }
    } else {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this order',
        });
      }
    }

    // Update allowed fields
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    // Populate before sending response
    await order.populate([
      { path: 'user', select: 'name email phone userType' },
      { path: 'bindingType', select: 'name' },
    ]);

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order',
    });
  }
};

// @desc    Delete order (soft delete - set isActive to false)
// @route   DELETE /api/orders/:id
// @access  Private
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.user) {
      if (order.user.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this order',
        });
      }
    } else {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this order',
        });
      }
    }

    // Soft delete
    order.isActive = false;
    await order.save();

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting order',
    });
  }
};

// @desc    Get all admin orders (admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, userId, limit = 20, page = 1 } = req.query;

    // Build query
    // Build query (include legacy orders)
    const query = { isActive: { $ne: false } };
    if (status) {
      query.status = status;
    }
    if (userId) {
      query.user = userId;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const total = await Order.countDocuments(query);

    // Get orders
    const orders = await Order.find(query)
      .populate('user', 'name email phone userType')
      .populate('bindingType', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders',
    });
  }
};

// @desc    Calculate order price based on config
// @route   GET /api/orders/calculate/price
// @access  Public
exports.calculateOrderPrice = async (req, res) => {
  try {
    let { colorType, sideType, pageCount, bindingType, quantity, userType = 'regular' } = req.query;

    // Normalize and decode URL-encoded values
    colorType = decodeURIComponent(colorType || '').trim();
    sideType = decodeURIComponent(sideType || '').trim();

    // Debug logging
    console.log('Price calculation request:', {
      colorType,
      sideType,
      pageCount,
      bindingType,
      quantity,
      userType
    });

    // Validate required fields
    if (!colorType || !sideType || !pageCount || !bindingType || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required query parameters: colorType, sideType, pageCount, bindingType, quantity',
      });
    }

    // Validate binding type exists
    const bindingTypeDoc = await BindingType.findById(bindingType);
    if (!bindingTypeDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid binding type',
      });
    }

    const pageCountNum = parseInt(pageCount);

    // Find matching printing price (Normal Print rules set by admin)
    // Try exact match first
    let printingPrice = await PrintingPrice.findOne({
      serviceType: 'Normal Print',
      colorType: colorType,
      sideType: sideType,
      pageRangeStart: { $lte: pageCountNum },
      pageRangeEnd: { $gte: pageCountNum },
      isActive: true,
    });

    // If no exact match, try with "Both" options (rules that apply to all color/side types)
    if (!printingPrice) {
      printingPrice = await PrintingPrice.findOne({
        serviceType: 'Normal Print',
        $and: [
          {
            $or: [
              { colorType: colorType },
              { colorType: 'Both' }
            ]
          },
          {
            $or: [
              { sideType: sideType },
              { sideType: 'Both' }
            ]
          }
        ],
        pageRangeStart: { $lte: pageCountNum },
        pageRangeEnd: { $gte: pageCountNum },
        isActive: true,
      });
    }

    // Debug: Log available rules for troubleshooting
    if (!printingPrice) {
      // Check ALL rules (not just active) to see what exists
      const allRules = await PrintingPrice.find({})
        .select('serviceType colorType sideType pageRangeStart pageRangeEnd isActive')
        .limit(10)
        .lean();

      const activeNormalPrintRules = await PrintingPrice.find({
        serviceType: 'Normal Print',
        isActive: true
      }).select('colorType sideType pageRangeStart pageRangeEnd').limit(5).lean();

      console.log('❌ No matching price rule found.');
      console.log('Looking for:', {
        colorType,
        sideType,
        pageCount: pageCountNum,
        serviceType: 'Normal Print',
        isActive: true
      });
      console.log('📊 Total rules in database:', allRules.length);
      console.log('📋 Sample rules (first 10):', JSON.stringify(allRules, null, 2));
      console.log('✅ Active Normal Print rules:', JSON.stringify(activeNormalPrintRules, null, 2));

      // Check if rules exist but with different serviceType
      const serviceTypes = await PrintingPrice.distinct('serviceType');
      console.log('📌 Available serviceTypes:', serviceTypes);
    } else {
      console.log('✅ Found matching price rule:', {
        colorType: printingPrice.colorType,
        sideType: printingPrice.sideType,
        pageRange: `${printingPrice.pageRangeStart}-${printingPrice.pageRangeEnd}`,
        regularPrice: printingPrice.regularPrice
      });
    }

    if (!printingPrice) {
      return res.status(404).json({
        success: false,
        message: 'No printing price rule found. Add rules in Admin → Normal Print Pricing.',
      });
    }

    // Find matching binding price
    const bindingPriceDoc = await BindingPrice.findOne({
      bindingType,
      pageRangeStart: { $lte: parseInt(pageCount) },
      pageRangeEnd: { $gte: parseInt(pageCount) },
      isActive: true,
    });

    // Get appropriate price based on user type
    const priceKey = userType === 'student' ? 'studentPrice' : userType === 'institute' ? 'institutePrice' : 'regularPrice';

    const printingCost = printingPrice[priceKey] || printingPrice.regularPrice;
    const bindingCost = bindingPriceDoc ? bindingPriceDoc[priceKey] || bindingPriceDoc.regularPrice : 0;

    const pricePerCopy = printingCost + bindingCost;
    const totalPrice = pricePerCopy * parseInt(quantity);

    res.json({
      success: true,
      data: {
        printingPrice: printingCost,
        bindingPrice: bindingCost,
        pricePerCopy,
        quantity: parseInt(quantity),
        totalPrice,
      },
    });
  } catch (error) {
    console.error('Calculate order price error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error calculating price',
    });
  }
};

// @desc    Get order statistics (admin only)
// @route   GET /api/orders/stats/overview
// @access  Private/Admin
exports.getOrderStats = async (req, res) => {
  try {
    // Stats with legacy support
    const activeQuery = { isActive: { $ne: false } };
    const totalOrders = await Order.countDocuments(activeQuery);
    const pendingOrders = await Order.countDocuments({ status: 'pending', ...activeQuery });
    const processingOrders = await Order.countDocuments({ status: 'processing', ...activeQuery });
    const completedOrders = await Order.countDocuments({ status: 'completed', ...activeQuery });

    // Get total revenue (only from paid orders)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid', isActive: { $ne: false } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching statistics',
    });
  }
};
