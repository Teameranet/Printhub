const PrintingPrice = require('../models/PrintingPrice');

// Get all printing prices with optional filters
const getAllPrintingPrices = async (req, res) => {
  try {
    const { serviceType, colorType, sideType, isActive, includeAll } = req.query;

    // Build filter object
    const filter = {};
    
    // If includeAll is true, don't filter by isActive (get all rules)
    // Otherwise, default to active rules only
    if (includeAll !== 'true') {
      filter.isActive = true;
    }
    
    if (serviceType) filter.serviceType = serviceType;
    if (colorType) filter.colorType = colorType;
    if (sideType) filter.sideType = sideType;
    if (isActive !== undefined && includeAll !== 'true') filter.isActive = isActive === 'true';

    const prices = await PrintingPrice.find(filter)
      .populate('createdBy', 'name email')
      .sort({ serviceType: 1, colorType: 1, sideType: 1, pageRangeStart: 1 });

    res.status(200).json({
      success: true,
      data: prices,
      count: prices.length
    });
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get prices by service type
const getPricesByServiceType = async (req, res) => {
  try {
    const { serviceType } = req.params;

    const prices = await PrintingPrice.find({
      serviceType,
      isActive: true
    })
      .populate('createdBy', 'name email')
      .sort({ colorType: 1, sideType: 1, pageRangeStart: 1 });

    if (!prices.length) {
      return res.status(404).json({
        success: false,
        message: `No pricing found for ${serviceType}`
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
    const { serviceType, colorType, sideType, pageCount } = req.query;

    if (!serviceType || !colorType || !sideType || !pageCount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceType, colorType, sideType, and pageCount'
      });
    }

    const price = await PrintingPrice.findOne({
      serviceType,
      colorType,
      sideType,
      pageRangeStart: { $lte: pageCount },
      pageRangeEnd: { $gte: pageCount },
      isActive: true
    });

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

// Create new pricing rule
const createPrintingPrice = async (req, res) => {
  try {
    const {
      serviceType,
      colorType,
      sideType,
      pageRangeStart,
      pageRangeEnd,
      studentPrice,
      institutePrice,
      regularPrice,
      description
    } = req.body;

    // Validation
    if (!serviceType || !colorType || !sideType || !pageRangeStart || !pageRangeEnd) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (pageRangeStart > pageRangeEnd) {
      return res.status(400).json({
        success: false,
        message: 'Page range start must be less than or equal to end'
      });
    }

    // Check for overlapping price ranges
    const existing = await PrintingPrice.findOne({
      serviceType,
      colorType,
      sideType,
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

    const price = new PrintingPrice({
      serviceType,
      colorType,
      sideType,
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
      message: 'Pricing rule created successfully',
      data: price
    });
  } catch (error) {
    console.error('Create price error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update pricing rule
const updatePrintingPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow direct update of page ranges if it would cause overlap
    if (updates.pageRangeStart || updates.pageRangeEnd) {
      const price = await PrintingPrice.findById(id);
      const newStart = updates.pageRangeStart || price.pageRangeStart;
      const newEnd = updates.pageRangeEnd || price.pageRangeEnd;

      if (newStart > newEnd) {
        return res.status(400).json({
          success: false,
          message: 'Page range start must be less than or equal to end'
        });
      }
    }

    const price = await PrintingPrice.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing rule updated successfully',
      data: price
    });
  } catch (error) {
    console.error('Update price error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete pricing rule (soft delete)
const deletePrintingPrice = async (req, res) => {
  try {
    const { id } = req.params;

    const price = await PrintingPrice.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!price) {
      return res.status(404).json({
        success: false,
        message: 'Pricing rule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing rule deleted successfully',
      data: price
    });
  } catch (error) {
    console.error('Delete price error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk create pricing rules
const bulkCreatePrintingPrices = async (req, res) => {
  try {
    const { rules } = req.body;

    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of pricing rules'
      });
    }

    // Add createdBy to all rules
    const rulesWithCreator = rules.map(rule => ({
      ...rule,
      createdBy: req.user.id
    }));

    const prices = await PrintingPrice.insertMany(rulesWithCreator);

    res.status(201).json({
      success: true,
      message: `${prices.length} pricing rules created successfully`,
      data: prices
    });
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Check for existing pricing rules
const checkExistingPrice = async (req, res) => {
  try {
    const {
      serviceType,
      colorType,
      sideType,
      pageRangeStart,
      pageRangeEnd
    } = req.query;

    if (!serviceType || !colorType || !sideType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceType, colorType, and sideType'
      });
    }

    // Check for exact match
    const exactMatch = await PrintingPrice.findOne({
      serviceType,
      colorType,
      sideType,
      pageRangeStart: parseInt(pageRangeStart) || 0,
      pageRangeEnd: parseInt(pageRangeEnd) || 1000,
      isActive: true
    });

    // Check for overlapping ranges
    const overlapping = await PrintingPrice.find({
      serviceType,
      colorType,
      sideType,
      isActive: true,
      $or: [
        {
          pageRangeStart: { $lte: parseInt(pageRangeStart) || 0 },
          pageRangeEnd: { $gte: parseInt(pageRangeStart) || 0 }
        },
        {
          pageRangeStart: { $lte: parseInt(pageRangeEnd) || 1000 },
          pageRangeEnd: { $gte: parseInt(pageRangeEnd) || 1000 }
        }
      ]
    });

    // Get all rules for this service/color/side combo
    const allRules = await PrintingPrice.find({
      serviceType,
      colorType,
      sideType,
      isActive: true
    }).sort({ pageRangeStart: 1 });

    res.status(200).json({
      success: true,
      exists: !!exactMatch,
      exactMatch: exactMatch || null,
      conflicting: overlapping.length > 0,
      conflicts: overlapping || [],
      allRules: allRules || [],
      message: exactMatch
        ? 'Exact match found'
        : overlapping.length > 0
        ? `${overlapping.length} overlapping rule(s) found`
        : 'No conflicts found'
    });
  } catch (error) {
    console.error('Check existing price error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Initialize default pricing rules (admin only)
const initializeDefaultPrices = async (req, res) => {
  try {
    // Check if any prices exist
    const existingPrices = await PrintingPrice.countDocuments({ isActive: true });

    if (existingPrices > 0) {
      return res.status(400).json({
        success: false,
        message: `${existingPrices} pricing rules already exist. Cannot initialize defaults.`,
        count: existingPrices
      });
    }

    const defaultRules = [
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Single Sided',
        pageRangeStart: 1,
        pageRangeEnd: 50,
        studentPrice: 1.50,
        institutePrice: 1.50,
        regularPrice: 2.00,
        description: 'B&W Single Sided 1-50 pages'
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Single Sided',
        pageRangeStart: 51,
        pageRangeEnd: 200,
        studentPrice: 1.25,
        institutePrice: 1.25,
        regularPrice: 1.75,
        description: 'B&W Single Sided 51-200 pages'
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Double Sided',
        pageRangeStart: 1,
        pageRangeEnd: 50,
        studentPrice: 1.20,
        institutePrice: 1.20,
        regularPrice: 1.60,
        description: 'B&W Double Sided 1-50 pages'
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Full Color',
        sideType: 'Single Sided',
        pageRangeStart: 1,
        pageRangeEnd: 50,
        studentPrice: 8.00,
        institutePrice: 8.00,
        regularPrice: 10.00,
        description: 'Color Single Sided 1-50 pages'
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Full Color',
        sideType: 'Double Sided',
        pageRangeStart: 1,
        pageRangeEnd: 50,
        studentPrice: 7.00,
        institutePrice: 7.00,
        regularPrice: 9.00,
        description: 'Color Double Sided 1-50 pages'
      }
    ];

    const rulesWithCreator = defaultRules.map(rule => ({
      ...rule,
      createdBy: req.user.id
    }));

    const created = await PrintingPrice.insertMany(rulesWithCreator);

    res.status(201).json({
      success: true,
      message: `${created.length} default pricing rules initialized`,
      data: created
    });
  } catch (error) {
    console.error('Initialize default prices error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllPrintingPrices,
  getPricesByServiceType,
  getPriceForConfig,
  createPrintingPrice,
  updatePrintingPrice,
  deletePrintingPrice,
  bulkCreatePrintingPrices,
  checkExistingPrice,
  initializeDefaultPrices
};
