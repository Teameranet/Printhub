# 🧪 Test Price API Directly

## Step 1: Make Sure Backend is Running

**Check your backend terminal** - you should see:
```
Server running on port 5000
MongoDB Connected: ...
```

If not, restart it:
```bash
cd backend
npm run dev
```

---

## Step 2: Check Backend Console When Testing

When you upload a file in Normal Print, **check your backend terminal**. You should see:

```
Price calculation request: {
  colorType: 'Black & White',
  sideType: 'Single Sided',
  pageCount: 1,
  bindingType: '698e18c3105e0b3d20f4e73c',
  quantity: 1
}
```

**Then either:**
- ✅ `Found matching price rule: { ... }`
- ❌ `No matching price rule found. Available rules: [ ... ]`

---

## Step 3: Test API Directly in Browser

Open this URL in your browser (replace `bindingType` with a valid ID):

```
http://localhost:5000/api/orders/calculate/price?colorType=Black%20%26%20White&sideType=Single%20Sided&pageCount=1&bindingType=698e18c3105e0b3d20f4e73c&quantity=1
```

**What you should see:**
- ✅ Success: `{"success":true,"data":{"totalPrice":...}}`
- ❌ Error: `{"success":false,"message":"No printing price rule found..."}`

---

## Step 4: Check Database Rules

**Most likely issue:** Your pricing rules don't cover **page 1**.

**Check in MongoDB:**
```javascript
// Find rules for page 1
db.printingprices.find({
  serviceType: 'Normal Print',
  colorType: 'Black & White',
  sideType: 'Single Sided',
  pageRangeStart: { $lte: 1 },
  pageRangeEnd: { $gte: 1 },
  isActive: true
})
```

**If this returns nothing:**
- Your rules probably start at page 2 or higher
- **Fix:** Create a rule with `pageRangeStart: 1`

---

## Step 5: Quick Fix - Create Rule for Page 1

1. **Go to Admin Panel** → Pricing Management
2. **Add New Rule:**
   - Service: `Normal Print`
   - Color: `Black & White` 
   - Side: `Single Sided`
   - **Page Range: 1 to 50** (or higher)
   - Regular Price: `2.00` (or your price)
   - Student Price: `2.00`
   - Institute Price: `2.00`
3. **Save**
4. **Test again**

---

## What to Share

When testing, please share:

1. **Backend console output** (the debug logs I added)
2. **Result of direct API test** (browser URL test)
3. **What page ranges your rules cover** (check in admin panel)

This will help identify the exact mismatch!
