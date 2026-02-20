# 🚨 Quick Fix: Price Not Showing

## The Problem

You're getting a **404 error** because:
1. ✅ The API route exists and works
2. ❌ **No pricing rules exist in your database**
3. The controller returns 404 when no rules are found

## ✅ Solution: Seed the Database

### Option 1: Run the Seed Script (Easiest)

```bash
cd backend
npm run seed:orders
```

This will:
- Create a "None" binding type
- Create a default printing price rule (B&W, Single Sided, 1-10000 pages, ₹2 per page)

### Option 2: Create Pricing Rules Manually

**Step 1:** Make sure you have at least one user in the database (register/login)

**Step 2:** Login as admin (or create admin user)

**Step 3:** Go to Admin Panel → Pricing Management → Click "Initialize Defaults"

OR use the API:

```bash
# Get admin token first (login via frontend)
# Then call:
curl -X POST http://localhost:5000/api/pricing/init/defaults \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🔍 Verify It's Fixed

After seeding:

1. **Check Database:**
   ```javascript
   // In MongoDB Compass or shell:
   db.printingprices.find({ isActive: true })
   // Should return at least 1 document
   ```

2. **Test the API directly:**
   ```bash
   # Replace bindingType with a valid ID from your database
   curl "http://localhost:5000/api/orders/calculate/price?colorType=Black%20%26%20White&sideType=Single%20Sided&pageCount=10&bindingType=YOUR_BINDING_ID&quantity=1"
   ```

3. **Test in Frontend:**
   - Go to Normal Print page
   - Upload a file
   - Configure settings
   - **Price should appear now!** ✅

---

## 📋 What the Seed Script Creates

- **Binding Type:** "None" (if doesn't exist)
- **Printing Price Rule:**
  - Service: Normal Print
  - Color: Black & White
  - Side: Single Sided
  - Pages: 1-10000
  - Regular Price: ₹2.00 per page
  - Student Price: ₹2.00 per page
  - Institute Price: ₹2.00 per page

---

## ⚠️ If Seed Script Fails

**Error: "No user found"**
- Solution: Register/login first, then run seed script again

**Error: "MongoDB connection failed"**
- Solution: Make sure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`

**Error: Script not found**
- Solution: Check `package.json` has the script:
  ```json
  "scripts": {
    "seed:orders": "node scripts/seedOrderDefaults.js"
  }
  ```

---

## 🎯 After Seeding

1. ✅ Restart backend server (if needed)
2. ✅ Refresh frontend page
3. ✅ Upload file in Normal Print
4. ✅ Price should calculate automatically!

**The 404 error will disappear once pricing rules exist!**
