# Razorpay Payment Gateway Setup Guide

This guide will help you set up Razorpay payment gateway integration for your PrintHub application.

## Prerequisites

- Razorpay account (Sign up at https://razorpay.com)
- Test/Live API keys from Razorpay dashboard
- Backend server running on Node.js
- Frontend application

---

## Step 1: Install Razorpay Package

Navigate to your backend directory and install the Razorpay SDK:

```bash
cd backend
npm install razorpay
```

---

## Step 2: Get Your Razorpay API Keys

1. **Login to Razorpay Dashboard**: https://dashboard.razorpay.com
2. Go to **Settings** → **API Keys**
3. Copy your **Key ID** and **Key Secret**
   - For testing: Use **Test Mode** keys
   - For production: Use **Live Mode** keys (after account activation)

**Your Test Credentials:**
- Key ID: `rzp_test_SHgC2bqdE3pRFw`
- Key Secret: `CN33y0YN5wKdxZ2fUJxVwN1c` (Keep this SECRET!)

---

## Step 3: Configure Backend Environment Variables

Create or update `backend/.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_SHgC2bqdE3pRFw
RAZORPAY_KEY_SECRET=CN33y0YN5wKdxZ2fUJxVwN1c
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Other existing variables...
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**⚠️ IMPORTANT:**
- Never commit `.env` file to Git
- Keep `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` secure
- Use different keys for test and production environments

---

## Step 4: Configure Frontend Environment Variables

Create or update `frontend/.env.local` file:

```env
# Razorpay Configuration (Public Key Only)
VITE_RAZORPAY_KEY_ID=rzp_test_SHgC2bqdE3pRFw

# Other existing variables...
VITE_API_URL=http://localhost:5000
```

**Note:** Only the Key ID goes in the frontend. The secret key stays ONLY in the backend.

---

## Step 5: Set Up Razorpay Webhook (Optional but Recommended)

Webhooks allow Razorpay to notify your server about payment events automatically.

1. **In Razorpay Dashboard:**
   - Go to **Settings** → **Webhooks**
   - Click **Add New Webhook**
   - Webhook URL: `https://yourdomain.com/api/payments/webhook`
   - For local testing, use a tool like **ngrok**:
     ```bash
     ngrok http 5000
     # Use the ngrok URL: https://xxxx.ngrok.io/api/payments/webhook
     ```
   - Select events: `payment.captured`, `payment.authorized`
   - Copy the **Webhook Secret** and add it to `backend/.env` as `RAZORPAY_WEBHOOK_SECRET`

---

## Step 6: Restart Your Servers

After configuring environment variables:

```bash
# Backend
cd backend
npm install  # Install razorpay package if not done
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

---

## Step 7: Test the Payment Flow

1. **Add items to cart** in your application
2. **Go to Checkout** page
3. **Fill in delivery details**
4. **Click "Pay ₹XXX"** button
5. **Razorpay popup** should appear
6. **Use test card details:**
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: `123`
   - Name: Any name
7. **Complete payment**
8. **Verify** that orders are created with `paymentStatus: 'paid'` in your database

---

## Payment Flow Architecture

```
1. User clicks "Pay" → Frontend validates form
2. Frontend calls → POST /api/payments/create-order (Backend creates Razorpay order)
3. Frontend creates → Database orders (unpaid, linked to Razorpay order ID)
4. Frontend opens → Razorpay Checkout popup
5. User completes → Payment in Razorpay
6. Frontend receives → Payment response (order_id, payment_id, signature)
7. Frontend calls → POST /api/payments/verify (Backend verifies signature)
8. Backend updates → Orders marked as 'paid' with payment details
9. Frontend navigates → Invoice page
```

---

## Security Features Implemented

✅ **Backend Signature Verification**: Payment signatures are verified on the server  
✅ **Razorpay API Verification**: Double-checks payment status with Razorpay API  
✅ **Webhook Support**: Handles payment events from Razorpay automatically  
✅ **Secure Key Storage**: Secret keys only in backend, never exposed to frontend  
✅ **Order Linking**: Database orders linked to Razorpay orders for tracking  

---

## Troubleshooting

### Payment popup doesn't open
- Check browser console for errors
- Verify `VITE_RAZORPAY_KEY_ID` is set in frontend `.env.local`
- Ensure Razorpay SDK script loads: Check Network tab for `checkout.js`

### Payment verification fails
- Check backend logs for signature verification errors
- Verify `RAZORPAY_KEY_SECRET` is correct in backend `.env`
- Ensure amount matches (Razorpay uses paise, backend converts)

### Orders not marked as paid
- Check backend logs for verification errors
- Verify webhook is configured (if using)
- Check database: `razorpayOrderId`, `razorpayPaymentId` fields should be populated

### Webhook not working
- Verify webhook URL is accessible (use ngrok for local testing)
- Check `RAZORPAY_WEBHOOK_SECRET` matches dashboard
- Check backend logs for webhook events

---

## Production Checklist

Before going live:

- [ ] Switch to **Live Mode** API keys in Razorpay dashboard
- [ ] Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in production `.env`
- [ ] Update `VITE_RAZORPAY_KEY_ID` in frontend production build
- [ ] Configure production webhook URL (no ngrok)
- [ ] Test with real payment (small amount)
- [ ] Enable SSL/HTTPS for webhook endpoint
- [ ] Set up monitoring for failed payments
- [ ] Review Razorpay dashboard for transaction logs

---

## API Endpoints

### Create Razorpay Order
```
POST /api/payments/create-order
Body: { amount, currency, receipt, notes }
Response: { success, data: { orderId, amount, currency } }
```

### Verify Payment
```
POST /api/payments/verify
Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderIds }
Response: { success, data: { verified, ordersUpdated, paymentId } }
```

### Webhook (Called by Razorpay)
```
POST /api/payments/webhook
Headers: x-razorpay-signature
Body: Razorpay webhook payload
```

---

## Support

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: support@razorpay.com
- Test Cards: https://razorpay.com/docs/payments/test-cards/

---

**✅ Setup Complete!** Your payment gateway is now integrated and ready to use.
