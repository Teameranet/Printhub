const mongoose = require('mongoose');

const bindingPriceSchema = new mongoose.Schema(
  {
    bindingType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BindingType',
      required: [true, 'Please specify the binding type'],
      index: true
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
    indexes: [
      { bindingType: 1, pageRangeStart: 1 }
    ]
  }
);

// Index for efficient querying
bindingPriceSchema.index({ bindingType: 1, isActive: 1 });

const BindingPrice = mongoose.model('BindingPrice', bindingPriceSchema);

module.exports = BindingPrice;
