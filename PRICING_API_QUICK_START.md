# Pricing API - Quick Start & Testing Guide

## Quick Start (5 minutes)

### Step 1: Login as Admin
1. Go to `http://localhost:3000/admin/login`
2. Use your admin credentials

### Step 2: Navigate to Pricing Management
1. Go to `http://localhost:3000/admin/pricing`
2. You should see a message: "No pricing rules found. Showing defaults (read-only)"

### Step 3: Initialize Default Prices
1. Click the **"Initialize Defaults"** button (green button)
2. Confirm the action in the popup
3. Wait for "5 default pricing rules initialized" message
4. The table will populate with default pricing rules

### Step 4: Test Adding Custom Rules
1. Click **"Add Price Rule"** button (pink button)
2. Fill in the form:
   - Color: Black & White
   - Sides: Single Sided
   - From Page: 201
   - To Page: 500
   - Student Price: 0.99
   - Institute Price: 0.99
   - Regular Price: 1.40
3. Click the "+" button to add another rule (optional)
4. Click **"Create Rules"**
5. System will check for conflicts and create the rules
6. New rules appear in the table

## API Testing with cURL

### 1. Initialize Default Prices
```bash
curl -X POST http://localhost:5000/api/pricing/init/defaults \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### 2. Check for Existing Prices
```bash
curl "http://localhost:5000/api/pricing/check/existing?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageRangeStart=1&pageRangeEnd=50"
```

### 3. Create a New Pricing Rule
```bash
curl -X POST http://localhost:5000/api/pricing \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 201,
    "pageRangeEnd": 500,
    "studentPrice": 0.99,
    "institutePrice": 0.99,
    "regularPrice": 1.40,
    "description": "B&W Single Sided 201-500 pages"
  }'
```

### 4. Get All Prices
```bash
curl "http://localhost:5000/api/pricing" \
  -H "Content-Type: application/json"
```

### 5. Get Price for Specific Configuration
```bash
curl "http://localhost:5000/api/pricing/config?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageCount=75"
```

### 6. Update a Price Rule
```bash
curl -X PUT http://localhost:5000/api/pricing/RULE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentPrice": 1.00,
    "regularPrice": 1.50
  }'
```

### 7. Delete a Price Rule
```bash
curl -X DELETE http://localhost:5000/api/pricing/RULE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Conflict Detection Test

### Test Overlapping Ranges
```bash
# First, check existing ranges
curl "http://localhost:5000/api/pricing/check/existing?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageRangeStart=40&pageRangeEnd=60"

# Response will show conflicts if any
```

### Create Rule with Conflict
Try adding a rule from pages 45-75 when rules for 1-50 and 51-200 already exist:
- System will detect overlap
- Shows: "2 overlapping rule(s) found"
- Admin can choose to proceed or cancel

## Testing Scenarios

### Scenario 1: Fresh Setup
1. Empty database - no pricing rules
2. Click "Initialize Defaults"
3. System creates 5 default rules
4. Verify all rules appear in table

### Scenario 2: Add Non-Conflicting Rule
1. Add rule: B&W Single, pages 201-500
2. System checks and confirms no conflicts
3. Rule is created successfully

### Scenario 3: Try to Add Conflicting Rule
1. Try to add rule: B&W Single, pages 40-60 (conflicts with 1-50 and 51-200)
2. System shows conflict warning with "⚠️ Conflicts detected"
3. Lists the overlapping rules
4. Click OK to proceed or Cancel to abort

### Scenario 4: Edit Existing Rule
1. Click on a rule row to edit
2. Change prices
3. Click Save icon
4. Rule updates in database

### Scenario 5: Delete Rule
1. Click Delete icon
2. Confirm in popup
3. Rule is marked inactive
4. Disappears from active rules list

## Troubleshooting

### "Initialize Defaults" button doesn't appear
- **Cause:** Pricing rules already exist in database
- **Solution:** This is expected behavior. Button only shows when no rules exist

### "Cannot initialize, X rules already exist"
- **Cause:** Database already has active pricing rules
- **Solution:** Use "Add Price Rule" to add new rules instead

### "Price range overlaps with existing rule"
- **Cause:** Trying to add a rule with conflicting page ranges
- **Solution:** Check existing ranges or modify the page range to avoid overlap

### No data showing in table
- **Cause:** Backend not running or API URL incorrect
- **Solution:** 
  - Verify backend is running on port 5000
  - Check browser console for API errors
  - Check that VITE_API_URL is set correctly

### 401 Unauthorized Error
- **Cause:** Not logged in or token expired
- **Solution:** Login again to get fresh token

### 403 Forbidden Error
- **Cause:** User is not an admin
- **Solution:** Use admin account to access pricing management

## Database Verification

### Check if Prices Exist
```bash
# Using MongoDB CLI
mongo
> db.printingprices.find().pretty()
```

### Count Pricing Rules
```bash
> db.printingprices.countDocuments({isActive: true})
```

### View Specific Rule
```bash
> db.printingprices.findOne({colorType: "Black & White", sideType: "Single Sided"})
```

## Frontend Debugging

### Enable Console Logging
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for messages like:
   - "Fetched X pricing rules from backend"
   - "Mapping pricing rule: ..."
   - "Failed to add rules: ..."

### Check Network Requests
1. Open DevTools → Network tab
2. Click "Add Price Rule"
3. Monitor requests:
   - `GET /api/pricing/check/existing` - conflict checking
   - `POST /api/pricing/bulk/create` - rule creation

### Check Local Storage
1. Open DevTools → Application → Local Storage
2. Verify `token` is present (admin token)
3. Check `VITE_API_URL` configuration

## Performance Tips

- First load may take 2-3 seconds for conflict checking
- Bulk create is faster than individual creates
- Avoid creating many overlapping rules (affects search)
- Use pagination if managing 100+ rules (feature to add)

## Next Steps

After pricing is set up:
1. Test ordering with different page counts
2. Verify pricing calculation uses correct rules
3. Add binding/folding prices for complete pricing management
4. Create pricing reports/analytics

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API responses in Network tab
3. Check database for data integrity
4. Review error messages in save notification
