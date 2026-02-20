const BindingPrice = require('../models/BindingPrice');
const BindingType = require('../models/BindingType');

// ===== BINDING TYPES =====

// Get all binding types
const getAllBindingTypes = async (req, res) => {
  try {
    const types = await BindingType.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: types,
      count: types.length
    });
  } catch (error) {
    console.error('Get binding types error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new binding type
const createBindingType = async (req, res) => {
  try {
    const { name } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a binding type name'
      });
    }

    // Check if name already exists
    const existing = await BindingType.findOne({ name: name.trim(), isActive: true });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Binding type with this name already exists'
      });
    }

    const type = new BindingType({
      name: name.trim(),
      isActive: true
    });

    await type.save();

    res.status(201).json({
      success: true,
      message: 'Binding type created successfully',
      data: type
    });
  } catch (error) {
    console.error('Create binding type error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update binding type
const updateBindingType = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const type = await BindingType.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Binding type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Binding type updated successfully',
      data: type
    });
  } catch (error) {
    console.error('Update binding type error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete binding type (soft delete)
const deleteBindingType = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await BindingType.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Binding type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Binding type deleted successfully',
      data: type
    });
  } catch (error) {
    console.error('Delete binding type error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== BINDING PRICING =====

// Get all binding prices with optional filters
const getAllBindingPrices = async (req, res) => {
  try {
    const { bindingType, isActive, includeAll } = req.query;

    // Build filter object
    const filter = {};
    
    // If includeAll is true, don't filter by isActive (get all rules)
    // Otherwise, default to active rules only
    if (includeAll !== 'true') {
      filter.isActive = true;
    }
    
    if (bindingType) filter.bindingType = bindingType;
    if (isActive !== undefined && includeAll !== 'true') filter.isActive = isActive === 'true';

    const prices = await BindingPrice.find(filter)
      .populate('createdBy', 'name email')
      .populate('bindingType', 'name')
      .sort({ bindingType: 1, pageRangeStart: 1 });

    res.status(200).json({
      success: true,
      data: prices,
      count: prices.length
    });
  } catch (error) {
    console.error('Get binding prices error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get prices by binding type
const getPricesByBindingType = async (req, res) => {
  try {
    const { bindingType } = req.params;

    const prices = await BindingPrice.find({
      bindingType,
      isActive: true
    })
      .populate('createdBy', 'name email')
      .populate('bindingType', 'name')
      .sort({ pageRangeStart: 1 });

    if (!prices.length) {
      return res.status(404).json({
        success: false,
        message: `No pricing found for ${bindingType}`
      });
    }

    res.status(200).json({
      success: true,
      data: prices
    });
  } catch (error) {
    console.error('Get prices by type error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get price for specific configuration
const getPriceForConfig = async (req, res) => {
  try {
    const { bindingType, pageCount } = req.query;

    if (!bindingType || !pageCount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bindingType and pageCount'
      });
    }

    const price = await BindingPrice.findOne({
      bindingType,
      pageRangeStart: { $lte: pageCount },
      pageRangeEnd: { $gte: pageCount },
      isActive: true
    })
      .populate('bindingType', 'name');

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'No pricing rule found for this configuration'
      });
    }

    res.status(200).json({
      success: true,
      data: price
    });
  } catch (error) {
    console.error('Get price for config error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new binding price rule
const createBindingPrice = async (req, res) => {
  try {
    const {
      bindingType,
      pageRangeStart,
      pageRangeEnd,
      studentPrice,
      institutePrice,
      regularPrice,
      description
    } = req.body;

    // Validation
    if (!bindingType || !pageRangeStart || !pageRangeEnd) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate that binding type exists
    const typeExists = await BindingType.findById(bindingType);
    if (!typeExists) {
      return res.status(404).json({
        success: false,
        message: 'Binding type not found'
      });
    }

    if (pageRangeStart > pageRangeEnd) {
      return res.status(400).json({
        success: false,
        message: 'Page range start must be less than or equal to end'
      });
    }

    // Check for overlapping price ranges
    const existing = await BindingPrice.findOne({
      bindingType,
      $or: [
        { pageRangeStart: { $lte: pageRangeStart }, pageRangeEnd: { $gte: pageRangeStart } },
        { pageRangeStart: { $lte: pageRangeEnd }, pageRangeEnd: { $gte: pageRangeEnd } },
        { pageRangeStart: { $gte: pageRangeStart }, pageRangeEnd: { $lte: pageRangeEnd } }
      ],
      isActive: true
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Price range overlaps with existing rule'
      });
    }

    const price = new BindingPrice({
      bindingType,
      pageRangeStart,
      pageRangeEnd,
      studentPrice,
      institutePrice,
      regularPrice,
      description,
      createdBy: req.user.id
    });

    await price.save();

    res.status(201).json({
      success: true,
      message: 'Binding price rule created successfully',
      data: price
    });
  } catch (error) {
    console.error('Create binding price error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update binding price rule
const updateBindingPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate page ranges if being updated
    if (updates.pageRangeStart || updates.pageRangeEnd) {
      const price = await BindingPrice.findById(id);
      const newStart = updates.pageRangeStart || price.pageRangeStart;
      const newEnd = updates.pageRangeEnd || price.pageRangeEnd;

      if (newStart > newEnd) {
        return res.status(400).json({
          success: false,
          message: 'Page range start must be less than or equal to end'
        });
      }
    }

    const price = await BindingPrice.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Binding price rule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Binding price rule updated successfully',
      data: price
    });
  } catch (error) {
    console.error('Update binding price error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete binding price rule (soft delete)
const deleteBindingPrice = async (req, res) => {
  try {
    const { id } = req.params;

    const price = await BindingPrice.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Binding price rule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Binding price rule deleted successfully',
      data: price
    });
  } catch (error) {
    console.error('Delete binding price error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk create binding prices
const bulkCreateBindingPrices = async (req, res) => {
  try {
    const { rules } = req.body;

    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of binding price rules'
      });
    }

    // Add createdBy to all rules
    const rulesWithCreator = rules.map(rule => ({
      ...rule,
      createdBy: req.user.id
    }));

    const prices = await BindingPrice.insertMany(rulesWithCreator);

    res.status(201).json({
      success: true,
      message: `${prices.length} binding price rules created successfully`,
      data: prices
    });
  } catch (error) {
    console.error('Bulk create binding prices error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  // Binding Types
  getAllBindingTypes,
  createBindingType,
  updateBindingType,
  deleteBindingType,
  // Binding Prices
  getAllBindingPrices,
  getPricesByBindingType,
  getPriceForConfig,
  createBindingPrice,
  updateBindingPrice,
  deleteBindingPrice,
  bulkCreateBindingPrices
};
