const mongoose = require('mongoose');

// Generate a unique human-readable order ID (satisfies existing unique index on orderId)
function generateOrderId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      sparse: true, // allow multiple nulls if any; unique only for non-null
      default: generateOrderId,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestName: {
      type: String,
      trim: true,
      maxlength: [100, 'Guest name cannot exceed 100 characters'],
    },
    guestPhone: {
      type: String,
      trim: true,
      maxlength: [20, 'Guest phone cannot exceed 20 characters'],
    },
    colorType: {
      type: String,
      enum: ['B&W', 'Color'],
      required: [true, 'Color type is required'],
    },
    sideType: {
      type: String,
      enum: ['Single', 'Double'],
      required: [true, 'Side type is required'],
    },
    pageCount: {
      type: Number,
      required: [true, 'Page count is required'],
      min: [1, 'Page count must be at least 1'],
      max: [10000, 'Page count cannot exceed 10000'],
    },
    bindingType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BindingType',
      required: [true, 'Binding type is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [1000, 'Quantity cannot exceed 1000'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    items: [
      {
        description: String,
        pricePerUnit: Number,
        quantity: Number,
      },
    ],
    files: {
      type: [
        {
          originalName: String,
          filename: String,
          mimeType: String,
          size: Number,
          path: String,
        }
      ],
      validate: [
        function (val) {
          return val.length > 0;
        },
        'At least one file is required'
      ]
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
    },
    razorpaySignature: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Middleware to populate user and binding type on find queries
orderSchema.pre(/^find/, function () {
  // Safely check options
  const options = this.getOptions ? this.getOptions() : this.options;
  if (options && options._recursed) {
    return;
  }

  this.populate({
    path: 'user',
    select: 'name email phone userType',
  }).populate({
    path: 'bindingType',
    select: 'name',
  });
});

module.exports = mongoose.model('Order', orderSchema);
