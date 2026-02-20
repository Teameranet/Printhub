# 🔧 Fixing Current Issues

## Issue 1: WebSocket Connection Error ✅ FIXED

**Problem:** Vite HMR trying to connect to wrong port

**Fix Applied:** Updated `frontend/vite.config.js` with proper HMR configuration

**Action Required:** Restart your frontend server:
```bash
cd frontend
npm run dev
```

---

## Issue 2: 404 Error on Price Calculation API

**Problem:** `/api/orders/calculate/price` returns 404

**Root Cause:** The API expects specific format:
- `colorType`: `'Black & White'` or `'Full Color'` (not `'B&W'` or `'Color'`)
- `sideType`: `'Single Sided'` or `'Double Sided'` (not `'Single'` or `'Double'`)

**Check:** The route exists at `/api/orders/calculate/price` and is registered correctly.

**Action Required:** 
1. Verify backend is running on port 5000
2. Check browser Network tab - what exact URL is being called?
3. The API should work once pricing rules are set up (see Issue 3)

---

## Issue 3: No Printing Price Rules Found ⚠️ NEEDS ACTION

**Problem:** Database has no pricing rules, so price calculation fails

**Solution Options:**

### Option A: Run Seed Script (Quickest)
```bash
cd backend
npm run seed:orders
```

This creates:
- A "None" binding type
- A default printing price rule (B&W, Single Sided, 1-10000 pages)

### Option B: Initialize Default Prices via Admin API

1. **Login as admin** (or create admin user first)

2. **Call the initialize API:**
```bash
# Get admin token first (login via frontend or API)
# Then call:
curl -X POST http://localhost:5000/api/pricing/init/defaults \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

This creates 5 default pricing rules covering common scenarios.

### Option C: Create Pricing Rules Manually via Admin Panel

1. Login as admin
2. Go to Admin → Pricing Management
3. Click "Initialize Defaults" or create rules manually

---

## Quick Fix Steps (Do This Now)

### Step 1: Restart Frontend (fixes WebSocket)
```bash
cd frontend
# Stop current server (Ctrl+C)
npm run dev
```

### Step 2: Seed Database (fixes pricing rules)
```bash
cd backend
npm run seed:orders
```

### Step 3: Verify Backend is Running
```bash
# Check backend console shows:
# Server running on port 5000
# MongoDB Connected: ...
```

### Step 4: Test Price Calculation
1. Go to Normal Print page
2. Upload a file
3. Configure print settings
4. Price should calculate now (no more 404 or "no rules found")

---

## Verify Everything Works

After fixes, check:

1. **Backend running:** `http://localhost:5000` shows JSON response
2. **Frontend running:** `http://localhost:3000` loads without WebSocket errors
3. **Price calculation:** Normal Print page shows prices
4. **Database:** Has at least one PrintingPrice document

---

## Still Having Issues?

### Check Backend Logs:
```bash
# In backend terminal, you should see:
# - Server running on port 5000
# - MongoDB Connected: ...
# - No 404 errors for /api/orders/calculate/price
```

### Check Frontend Console:
- No WebSocket errors
- API calls return 200 (not 404)
- Price calculation works

### Check Database:
```javascript
// In MongoDB shell or Compass:
db.printingprices.find({ isActive: true })
// Should return at least 1 document
```

---

**🎯 Priority: Run `npm run seed:orders` in backend folder - this fixes the pricing issue!**
