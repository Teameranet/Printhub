# 🔧 Fix Price Calculation - Do This Now!

## The Issue

Your API route is working fine, but **there are no pricing rules in your database**. That's why you get a 404 error.

## ✅ Quick Fix (2 Steps)

### Step 1: Make sure you have at least one user

**If you haven't registered yet:**
1. Go to your frontend: `http://localhost:3000`
2. Click "Sign Up" or "Register"
3. Create an account

**If you already have an account:** Skip to Step 2

---

### Step 2: Run the Seed Script

Open your terminal and run:

```bash
cd backend
npm run seed:orders
```

**Expected Output:**
```
MongoDB connected for seed
✅ Created BindingType "None"
✅ Created default PrintingPrice (B&W, Single Sided, 1-10000 pages, ₹2/page)
Seed completed.
```

---

## ✅ Verify It Works

1. **Refresh your frontend page** (Normal Print)
2. **Upload a file**
3. **Configure print settings**
4. **Price should appear automatically!** 🎉

---

## 🔍 If Seed Script Fails

### Error: "No user found"

**Solution:**
1. Register/login first (creates a user in database)
2. Run `npm run seed:orders` again

### Error: "MongoDB connection failed"

**Solution:**
1. Make sure MongoDB is running
2. Check `backend/.env` has correct `MONGODB_URI`
3. Try: `mongodb://localhost:27017/printhub`

### Error: "Script not found"

**Solution:**
The script exists at `backend/scripts/seedOrderDefaults.js`
Make sure you're in the `backend` folder when running the command.

---

## 📊 What Gets Created

After running the seed script, your database will have:

1. **Binding Type:** "None" (for orders without binding)
2. **Printing Price Rule:**
   - Black & White, Single Sided
   - 1-10000 pages
   - ₹2.00 per page (all user types)

This allows price calculation to work immediately!

---

## 🎯 Next Steps (Optional)

After the basic setup works, you can:

1. **Login as admin**
2. **Go to Admin Panel → Pricing Management**
3. **Click "Initialize Defaults"** to add more pricing rules:
   - Color printing
   - Double-sided printing
   - Different page ranges
   - Student/Institute discounts

---

**🚀 Run `npm run seed:orders` in the backend folder NOW to fix the price issue!**
