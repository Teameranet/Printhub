# 🚀 Quick Start: Razorpay Test Mode Setup

Follow these steps to start using Razorpay payment gateway in **test mode**:

---

## ✅ Step 1: Install Razorpay Package (Backend)

```bash
cd backend
npm install
```

This will install the `razorpay` package (already in package.json).

---

## ✅ Step 2: Verify Backend Environment Variables

Your `backend/.env` file should have:

```env
RAZORPAY_KEY_ID=rzp_test_SHgC2bqdE3pRFw
RAZORPAY_KEY_SECRET=CN33y0YN5wKdxZ2fUJxVwN1c
RAZORPAY_WEBHOOK_SECRET=
```

**✅ Already configured!** Your backend is ready.

---

## ✅ Step 3: Create Frontend Environment File

Create `frontend/.env.local` file with:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_SHgC2bqdE3pRFw
VITE_API_URL=http://localhost:5000
```

**Note:** Only the Key ID goes in frontend. The secret stays in backend only!

---

## ✅ Step 4: Start Your Servers

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
Environment: development
MongoDB Connected: ...
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## ✅ Step 5: Test Payment Flow

1. **Open your app** in browser: `http://localhost:5173`

2. **Add items to cart** (go to Normal Print page, upload files, configure print settings)

3. **Go to Checkout** page

4. **Fill in details:**
   - Full Name: `Test User`
   - Mobile: `9876543210`
   - Delivery option (Pickup or Delivery)

5. **Click "Pay ₹XXX"** button

6. **Razorpay popup should appear** with payment form

7. **Use Razorpay Test Card:**
   - **Card Number:** `4111 1111 1111 1111`
   - **Expiry Date:** `12/25` (any future date)
   - **CVV:** `123`
   - **Name:** Any name

8. **Click "Pay"** in Razorpay popup

9. **Payment should succeed** and redirect to invoice page

10. **Check your database** - orders should have `paymentStatus: 'paid'`

---

## 🧪 Test Cards Available

Razorpay provides these test cards:

| Card Number | Scenario |
|------------|----------|
| `4111 1111 1111 1111` | Success |
| `4000 0000 0000 0002` | Failure |
| `4000 0000 0000 9995` | 3DS Authentication |

**All test cards:**
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- Name: Any name

---

## 🔍 Verify It's Working

### Check Backend Logs:
When payment succeeds, you should see:
```
Payment verified and orders updated successfully
```

### Check Database:
```javascript
// In MongoDB or your admin panel
db.orders.findOne({ paymentStatus: 'paid' })
// Should show:
// - razorpayOrderId: "order_xxxxx"
// - razorpayPaymentId: "pay_xxxxx"
// - paymentStatus: "paid"
```

### Check Frontend:
- Payment popup opens ✅
- Payment completes ✅
- Redirects to invoice ✅
- Invoice shows order details ✅

---

## ❌ Troubleshooting

### Payment popup doesn't open?
- ✅ Check browser console for errors
- ✅ Verify `frontend/.env.local` exists with `VITE_RAZORPAY_KEY_ID`
- ✅ Restart frontend server after creating `.env.local`
- ✅ Check Network tab - Razorpay script should load from `checkout.razorpay.com`

### "Failed to create payment order" error?
- ✅ Check backend is running on port 5000
- ✅ Verify `backend/.env` has correct Razorpay keys
- ✅ Check backend console for errors
- ✅ Ensure MongoDB is connected

### Payment verification fails?
- ✅ Check backend logs for signature errors
- ✅ Verify `RAZORPAY_KEY_SECRET` matches your Razorpay dashboard
- ✅ Ensure you're using test mode keys (not live keys)

### Orders not marked as paid?
- ✅ Check backend logs during payment
- ✅ Verify payment verification API call succeeded
- ✅ Check database - look for `razorpayPaymentId` field

---

## 📝 Current Status

✅ **Backend:** Configured and ready  
✅ **Razorpay Package:** Installed  
✅ **Backend .env:** Configured with test keys  
⏳ **Frontend .env:** Need to create `.env.local`  
⏳ **Servers:** Need to start both  

---

## 🎯 Next Steps After Testing

Once test mode works:

1. **Test all scenarios:**
   - Successful payment
   - Failed payment
   - Payment cancellation

2. **Check order creation:**
   - Multiple items in cart
   - Guest checkout
   - Logged-in user checkout

3. **Verify database:**
   - Orders created correctly
   - Payment details stored
   - Status updated properly

4. **Ready for production?**
   - Switch to Live Mode keys in Razorpay dashboard
   - Update `.env` files with live keys
   - Set up production webhook URL

---

**🚀 You're all set! Follow Step 3 and Step 4 to start testing payments right now!**
