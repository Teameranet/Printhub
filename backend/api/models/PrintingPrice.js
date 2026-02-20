const mongoose = require('mongoose');

const printingPriceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      required: [true, 'Please specify the service type'],
      enum: ['Normal Print', 'Advanced Print', 'Binding', 'Lamination', 'Spiral Binding'],
      index: true
    },
    colorType: {
      type: String,
      enum: ['Black & White', 'Full Color', 'Both'],
      default: 'Black & White'
    },
    sideType: {
      type: String,
      enum: ['Single Sided', 'Double Sided', 'Both'],
      default: 'Single Sided'
    },
    pageRangeStart: {
      type: Number,
      required: [true, 'Specify starting page number'],
      min: 1
    },
    pageRangeEnd: {
      type: Number,
      required: [true, 'Specify ending page number'],
      min: 1
    },
    studentPrice: {
      type: Number,
      required: [true, 'Must provide student price'],
      min: [0, 'Price cannot be negative']
    },
    institutePrice: {
      type: Number,
      required: [true, 'Must provide institute price'],
      min: [0, 'Price cannot be negative']
    },
    regularPrice: {
      type: Number,
      required: [true, 'Must provide regular price'],
      min: [0, 'Price cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    // Compound index for efficient queries
    indexes: [
      { serviceType: 1, colorType: 1, sideType: 1, pageRangeStart: 1 }
    ]
  }
);

// Index for efficient querying
printingPriceSchema.index({ serviceType: 1, isActive: 1 });

const PrintingPrice = mongoose.model('PrintingPrice', printingPriceSchema);

module.exports = PrintingPrice;
