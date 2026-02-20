const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: [true, 'Please specify the service type'],
      index: true
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

pricingSchema.index({ serviceType: 1, isActive: 1 });

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;
