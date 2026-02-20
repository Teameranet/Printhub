# Pricing API Test Cases & Examples

## Test Environment Setup

### Prerequisites
- Backend running on `http://localhost:5000`
- Admin user account (for write operations)
- Bearer token from login

### Getting Admin Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpassword"
  }'

# Response includes token field - use this in Authorization header
```

## Test Cases

### Test 1: Initialize Default Prices (Fresh Database)

**Scenario:** Brand new system with no pricing rules

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing/init/defaults \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "5 default pricing rules initialized",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 1.50,
      "institutePrice": 1.50,
      "regularPrice": 2.00,
      "description": "B&W Single Sided 1-50 pages",
      "createdBy": "507f1f77bcf86cd799439012",
      "isActive": true,
      "createdAt": "2026-02-12T10:00:00Z",
      "updatedAt": "2026-02-12T10:00:00Z"
    },
    // ... 4 more rules
  ]
}
```

**Validation:**
- ✅ Status code: 201
- ✅ success: true
- ✅ 5 rules created
- ✅ All rules have isActive: true
- ✅ createdBy contains user ID

---

### Test 2: Initialize When Rules Already Exist

**Scenario:** Try to initialize again when rules already exist

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing/init/defaults \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "5 pricing rules already exist. Cannot initialize defaults.",
  "count": 5
}
```

**Validation:**
- ✅ Status code: 400
- ✅ success: false
- ✅ Correct error message
- ✅ Shows count of existing rules

---

### Test 3: Check for Existing Prices - No Conflicts

**Scenario:** Check if B&W Single page range 201-500 can be added

**Request:**
```bash
curl "http://localhost:5000/api/pricing/check/existing?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageRangeStart=201&pageRangeEnd=500"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "exists": false,
  "exactMatch": null,
  "conflicting": false,
  "conflicts": [],
  "allRules": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 1.50,
      "institutePrice": 1.50,
      "regularPrice": 2.00
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 51,
      "pageRangeEnd": 200,
      "studentPrice": 1.25,
      "institutePrice": 1.25,
      "regularPrice": 1.75
    }
  ],
  "message": "No conflicts found"
}
```

**Validation:**
- ✅ Status code: 200
- ✅ exists: false (exact match not found)
- ✅ conflicting: false (no overlaps)
- ✅ conflicts array empty
- ✅ allRules shows existing rules
- ✅ Message indicates no conflicts

---

### Test 4: Check for Existing Prices - With Conflicts

**Scenario:** Check if B&W Single page range 40-60 can be added (conflicts with 1-50 and 51-200)

**Request:**
```bash
curl "http://localhost:5000/api/pricing/check/existing?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageRangeStart=40&pageRangeEnd=60"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "exists": false,
  "exactMatch": null,
  "conflicting": true,
  "conflicts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 1.50,
      "institutePrice": 1.50,
      "regularPrice": 2.00
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 51,
      "pageRangeEnd": 200,
      "studentPrice": 1.25,
      "institutePrice": 1.25,
      "regularPrice": 1.75
    }
  ],
  "allRules": [
    // ... all existing rules
  ],
  "message": "2 overlapping rule(s) found"
}
```

**Validation:**
- ✅ Status code: 200
- ✅ conflicting: true
- ✅ conflicts array contains 2 rules
- ✅ Message shows count of conflicts
- ✅ Admin can use this to warn user

---

### Test 5: Create Single Pricing Rule

**Scenario:** Create a new rule for B&W Single pages 201-500

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing \
  -H "Authorization: Bearer ADMIN_TOKEN" \
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

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Pricing rule created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 201,
    "pageRangeEnd": 500,
    "studentPrice": 0.99,
    "institutePrice": 0.99,
    "regularPrice": 1.40,
    "description": "B&W Single Sided 201-500 pages",
    "createdBy": "507f1f77bcf86cd799439012",
    "isActive": true,
    "createdAt": "2026-02-12T10:05:00Z",
    "updatedAt": "2026-02-12T10:05:00Z"
  }
}
```

**Validation:**
- ✅ Status code: 201
- ✅ success: true
- ✅ Data returned with _id
- ✅ createdBy set to logged-in user
- ✅ isActive: true

---

### Test 6: Try to Create Overlapping Rule

**Scenario:** Try to create rule for pages 40-60 (conflicts with 1-50 and 51-200)

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 40,
    "pageRangeEnd": 60,
    "studentPrice": 1.30,
    "institutePrice": 1.30,
    "regularPrice": 1.80
  }'
```

**Expected Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Price range overlaps with existing rule"
}
```

**Validation:**
- ✅ Status code: 409
- ✅ success: false
- ✅ Clear error message about overlap

---

### Test 7: Bulk Create Multiple Rules

**Scenario:** Create 3 new rules at once for Color sector

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing/bulk/create \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [
      {
        "serviceType": "Normal Print",
        "colorType": "Full Color",
        "sideType": "Single Sided",
        "pageRangeStart": 51,
        "pageRangeEnd": 100,
        "studentPrice": 7.00,
        "institutePrice": 7.00,
        "regularPrice": 9.00,
        "description": "Color Single Sided 51-100 pages"
      },
      {
        "serviceType": "Normal Print",
        "colorType": "Full Color",
        "sideType": "Single Sided",
        "pageRangeStart": 101,
        "pageRangeEnd": 200,
        "studentPrice": 6.00,
        "institutePrice": 6.00,
        "regularPrice": 8.00,
        "description": "Color Single Sided 101-200 pages"
      },
      {
        "serviceType": "Normal Print",
        "colorType": "Full Color",
        "sideType": "Double Sided",
        "pageRangeStart": 51,
        "pageRangeEnd": 100,
        "studentPrice": 5.50,
        "institutePrice": 5.50,
        "regularPrice": 7.50,
        "description": "Color Double Sided 51-100 pages"
      }
    ]
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "3 pricing rules created successfully",
  "data": [
    { /* rule 1 */ },
    { /* rule 2 */ },
    { /* rule 3 */ }
  ]
}
```

**Validation:**
- ✅ Status code: 201
- ✅ success: true
- ✅ Message shows count: 3
- ✅ All 3 rules returned
- ✅ Each has _id and timestamps

---

### Test 8: Get All Pricing Rules

**Scenario:** Retrieve all active pricing rules

**Request:**
```bash
curl "http://localhost:5000/api/pricing"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 1.50,
      "institutePrice": 1.50,
      "regularPrice": 2.00,
      "description": "B&W Single Sided 1-50 pages",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "isActive": true
    },
    // ... 8+ more rules depending on what was created
  ],
  "count": 8
}
```

**Validation:**
- ✅ Status code: 200
- ✅ success: true
- ✅ data is array of rules
- ✅ count matches array length
- ✅ Each rule has full details
- ✅ createdBy is populated with user info

---

### Test 9: Get Price for Specific Configuration

**Scenario:** Calculate price for 75 pages, B&W Single Sided

**Request:**
```bash
curl "http://localhost:5000/api/pricing/config?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageCount=75"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 51,
    "pageRangeEnd": 200,
    "studentPrice": 1.25,
    "institutePrice": 1.25,
    "regularPrice": 1.75,
    "description": "B&W Single Sided 51-200 pages"
  }
}
```

**Note:** pageCount 75 falls in range 51-200, so that rule is returned

**Validation:**
- ✅ Status code: 200
- ✅ success: true
- ✅ Correct rule returned (51-200 range)
- ✅ Can use prices from this rule to calculate total

---

### Test 10: Update Pricing Rule

**Scenario:** Update prices for a rule (make it cheaper)

**Request:**
```bash
curl -X PUT http://localhost:5000/api/pricing/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentPrice": 1.15,
    "institutePrice": 1.15,
    "regularPrice": 1.65,
    "description": "B&W Single Sided 51-200 pages (Updated)"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Pricing rule updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 51,
    "pageRangeEnd": 200,
    "studentPrice": 1.15,
    "institutePrice": 1.15,
    "regularPrice": 1.65,
    "description": "B&W Single Sided 51-200 pages (Updated)",
    "createdBy": "507f1f77bcf86cd799439012",
    "isActive": true,
    "createdAt": "2026-02-12T10:00:00Z",
    "updatedAt": "2026-02-12T10:15:00Z"
  }
}
```

**Validation:**
- ✅ Status code: 200
- ✅ success: true
- ✅ Prices updated to new values
- ✅ updatedAt timestamp changed
- ✅ Other fields unchanged

---

### Test 11: Delete Pricing Rule

**Scenario:** Remove a pricing rule

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/pricing/507f1f77bcf86cd799439014 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Pricing rule deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 201,
    "pageRangeEnd": 500,
    "studentPrice": 0.99,
    "institutePrice": 0.99,
    "regularPrice": 1.40,
    "description": "B&W Single Sided 201-500 pages",
    "createdBy": "507f1f77bcf86cd799439012",
    "isActive": false,
    "createdAt": "2026-02-12T10:05:00Z",
    "updatedAt": "2026-02-12T10:20:00Z"
  }
}
```

**Validation:**
- ✅ Status code: 200
- ✅ success: true
- ✅ isActive: false (soft delete)
- ✅ Rule still in database but inactive
- ✅ Won't appear in getPrintingPrices() results

---

### Test 12: Error - Missing Required Field

**Scenario:** Try to create rule without pageRangeStart

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeEnd": 50,
    "studentPrice": 1.50,
    "institutePrice": 1.50,
    "regularPrice": 2.00
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**Validation:**
- ✅ Status code: 400
- ✅ success: false
- ✅ Clear error about required fields

---

### Test 13: Error - Invalid Page Range

**Scenario:** Try to create rule where start > end

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 100,
    "pageRangeEnd": 50,
    "studentPrice": 1.50,
    "institutePrice": 1.50,
    "regularPrice": 2.00
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Page range start must be less than or equal to end"
}
```

**Validation:**
- ✅ Status code: 400
- ✅ success: false
- ✅ Clear validation error message

---

### Test 14: Error - Unauthorized (No Token)

**Scenario:** Try to create rule without authentication

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 1,
    "pageRangeEnd": 50,
    "studentPrice": 1.50,
    "institutePrice": 1.50,
    "regularPrice": 2.00
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized access" // or similar auth error
}
```

**Validation:**
- ✅ Status code: 401
- ✅ Access denied without token

---

### Test 15: Error - Forbidden (Not Admin)

**Scenario:** Try to create rule with non-admin user token

**Request:**
```bash
curl -X POST http://localhost:5000/api/pricing \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d { /* rule data */ }
```

**Expected Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Admin access required" // or similar permission error
}
```

**Validation:**
- ✅ Status code: 403
- ✅ Only admins can create/update/delete

---

## Test Execution Order

For comprehensive testing, execute in this order:

1. **Initialize** - Test 1
2. **Check Conflicts** - Test 3 (no conflicts)
3. **Create Single** - Test 5
4. **Check Again** - Test 4 (with conflicts)
5. **Bulk Create** - Test 7
6. **Get All** - Test 8
7. **Get Specific** - Test 9
8. **Update** - Test 10
9. **Delete** - Test 11
10. **Error Cases** - Tests 12-15

---

## Automated Test Script (Bash)

Save as `test-pricing-api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:5000"
ADMIN_TOKEN="YOUR_ADMIN_TOKEN"

echo "=== Pricing API Tests ==="

echo "\n1. Getting all prices..."
curl "$API_URL/api/pricing"

echo "\n\n2. Checking for conflicts..."
curl "$API_URL/api/pricing/check/existing?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageRangeStart=201&pageRangeEnd=500"

echo "\n\n3. Creating new rule..."
curl -X POST "$API_URL/api/pricing" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 201,
    "pageRangeEnd": 500,
    "studentPrice": 0.99,
    "institutePrice": 0.99,
    "regularPrice": 1.40
  }'

echo "\n\n=== Tests Complete ==="
```

Run with:
```bash
chmod +x test-pricing-api.sh
./test-pricing-api.sh
```

---

## Tests Summary

| Test # | Scenario | Method | Status | Notes |
|--------|----------|--------|--------|-------|
| 1 | Initialize Defaults | POST | 201 | Fresh DB only |
| 2 | Init When Exists | POST | 400 | Cannot reinit |
| 3 | Check No Conflicts | GET | 200 | Safe to create |
| 4 | Check Conflicts | GET | 200 | Lists conflicts |
| 5 | Create Rule | POST | 201 | New rule added |
| 6 | Create Overlap | POST | 409 | Prevented |
| 7 | Bulk Create | POST | 201 | Multiple at once |
| 8 | Get All | GET | 200 | List all active |
| 9 | Get Config | GET | 200 | For order calculation |
| 10 | Update Rule | PUT | 200 | Prices updated |
| 11 | Delete Rule | DELETE | 200 | Soft deleted |
| 12 | Missing Field | POST | 400 | Validation error |
| 13 | Invalid Range | POST | 400 | Validation error |
| 14 | No Token | POST | 401 | Auth required |
| 15 | Not Admin | POST | 403 | Permission denied |

All tests passing = ✅ Pricing API ready for production
