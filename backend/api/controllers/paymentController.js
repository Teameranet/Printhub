const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private/Public (for guest orders)
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be greater than 0',
      });
    }

    // Amount should be in paise (smallest currency unit)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create Razorpay order',
    });
  }
};

// @desc    Verify payment signature and update order
// @route   POST /api/payments/verify
// @access  Private/Public
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderIds } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details',
      });
    }

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs are required',
      });
    }

    // Verify signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Verify payment with Razorpay API
    try {
      const payment = await razorpay.payments.fetch(razorpayPaymentId);
      
      if (payment.status !== 'captured' && payment.status !== 'authorized') {
        return res.status(400).json({
          success: false,
          message: `Payment not successful. Status: ${payment.status}`,
        });
      }

      // Update all orders with payment details
      const updateResult = await Order.updateMany(
        { _id: { $in: orderIds } },
        {
          $set: {
            paymentStatus: 'paid',
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
          },
        }
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified and orders updated successfully',
        data: {
          verified: true,
          ordersUpdated: updateResult.modifiedCount,
          paymentId: razorpayPaymentId,
        },
      });
    } catch (razorpayError) {
      console.error('Razorpay payment fetch error:', razorpayError);
      return res.status(400).json({
        success: false,
        message: 'Failed to verify payment with Razorpay',
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment',
    });
  }
};

// @desc    Razorpay webhook handler
// @route   POST /api/payments/webhook
// @access  Public (Razorpay calls this)
// Note: This route uses express.raw() middleware to get raw body for signature verification
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET not configured, skipping webhook verification');
      return res.status(200).json({ received: true });
    }

    // req.body is a Buffer when using express.raw()
    const bodyString = req.body.toString();
    
    // Verify webhook signature
    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyString)
      .digest('hex');

    if (generatedSignature !== webhookSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const webhookData = JSON.parse(bodyString);
    const event = webhookData.event;
    const payment = webhookData.payload?.payment?.entity;

    if (event === 'payment.captured' || event === 'payment.authorized') {
      if (payment) {
        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        // Find orders with this Razorpay order ID and update them
        await Order.updateMany(
          { razorpayOrderId },
          {
            $set: {
              paymentStatus: 'paid',
              razorpayPaymentId,
            },
          }
        );

        console.log(`Webhook: Payment ${razorpayPaymentId} captured for order ${razorpayOrderId}`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
};
