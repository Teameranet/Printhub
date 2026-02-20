const mongoose = require('mongoose');

const bindingTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide binding type name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Binding type name cannot exceed 100 characters'],
      index: true
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
    timestamps: true
  }
);

const BindingType = mongoose.model('BindingType', bindingTypeSchema);

module.exports = BindingType;
