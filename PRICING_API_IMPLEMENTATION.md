# Pricing API Implementation Guide

## Overview
The pricing system has been fully implemented with API endpoints that check for existing prices before creation and allow admins to manage pricing rules.

## Backend API Endpoints

### 1. Check Existing Prices
**Endpoint:** `GET /api/pricing/check/existing`

**Description:** Checks if a pricing rule exists or conflicts with existing rules.

**Query Parameters:**
- `serviceType` (required): Type of service (e.g., "Normal Print")
- `colorType` (required): Color type (e.g., "Black & White", "Full Color")
- `sideType` (required): Side type (e.g., "Single Sided", "Double Sided")
- `pageRangeStart` (optional): Page count start
- `pageRangeEnd` (optional): Page count end

**Example Request:**
```bash
GET /api/pricing/check/existing?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageRangeStart=1&pageRangeEnd=50
```

**Response:**
```json
{
  "success": true,
  "exists": false,
  "exactMatch": null,
  "conflicting": false,
  "conflicts": [],
  "allRules": [
    {
      "_id": "...",
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

### 2. Initialize Default Prices
**Endpoint:** `POST /api/pricing/init/defaults`

**Description:** Initializes the system with default pricing rules. Can only be done if no prices exist yet.

**Authentication:** Required (Admin only)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "5 default pricing rules initialized",
  "data": [
    {
      "_id": "...",
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 1.50,
      "institutePrice": 1.50,
      "regularPrice": 2.00,
      "description": "B&W Single Sided 1-50 pages"
    },
    // ... more rules
  ]
}
```

**Default Rules Created:**
1. **B&W Single Sided 1-50 pages:** ₹1.50 / ₹1.50 / ₹2.00
2. **B&W Single Sided 51-200 pages:** ₹1.25 / ₹1.25 / ₹1.75
3. **B&W Double Sided 1-50 pages:** ₹1.20 / ₹1.20 / ₹1.60
4. **Color Single Sided 1-50 pages:** ₹8.00 / ₹8.00 / ₹10.00
5. **Color Double Sided 1-50 pages:** ₹7.00 / ₹7.00 / ₹9.00

### 3. Create Pricing Rule
**Endpoint:** `POST /api/pricing`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "serviceType": "Normal Print",
  "colorType": "Black & White",
  "sideType": "Single Sided",
  "pageRangeStart": 201,
  "pageRangeEnd": 500,
  "studentPrice": 1.10,
  "institutePrice": 1.10,
  "regularPrice": 1.50,
  "description": "B&W Single Sided 201-500 pages"
}
```

**Validation:**
- All fields are required except `description`
- `pageRangeStart` must be ≤ `pageRangeEnd`
- Cannot create overlapping page ranges for the same color/side type
- Returns 409 if conflict detected

### 4. Bulk Create Pricing Rules
**Endpoint:** `POST /api/pricing/bulk/create`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "rules": [
    {
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
      "serviceType": "Normal Print",
      "colorType": "Full Color",
      "sideType": "Double Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 100,
      "studentPrice": 6.00,
      "institutePrice": 6.00,
      "regularPrice": 8.00
    }
  ]
}
```

### 5. Update Pricing Rule
**Endpoint:** `PUT /api/pricing/:id`

**Authentication:** Required (Admin only)

**Update allowed fields:**
- `studentPrice`
- `institutePrice`
- `regularPrice`
- `description`
- `pageRangeStart` / `pageRangeEnd` (with validation)

### 6. Delete Pricing Rule
**Endpoint:** `DELETE /api/pricing/:id`

**Authentication:** Required (Admin only)

**Note:** Uses soft delete (marks as inactive)

### 7. Get All Prices
**Endpoint:** `GET /api/pricing`

**Query Parameters:**
- `serviceType` (optional): Filter by service type
- `colorType` (optional): Filter by color type
- `sideType` (optional): Filter by side type
- `isActive` (optional): Filter by active status

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

### 8. Get Price for Specific Configuration
**Endpoint:** `GET /api/pricing/config`

**Query Parameters:**
- `serviceType` (required)
- `colorType` (required)
- `sideType` (required)
- `pageCount` (required): The number of pages to check

**Example:** `GET /api/pricing/config?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided&pageCount=75`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 51,
    "pageRangeEnd": 200,
    "studentPrice": 1.25,
    "institutePrice": 1.25,
    "regularPrice": 1.75
  }
}
```

## Frontend API Integration

The frontend API methods are available through `adminAPI`:

```javascript
import { adminAPI } from '@/lib/api';

// Check for existing prices
const result = await adminAPI.checkExistingPrice({
  serviceType: 'Normal Print',
  colorType: 'Black & White',
  sideType: 'Single Sided',
  pageRangeStart: 1,
  pageRangeEnd: 50
});

// Initialize defaults
const init = await adminAPI.initializeDefaultPrices();

// Create single price
const created = await adminAPI.createPrintingPrice({
  serviceType: 'Normal Print',
  colorType: 'Black & White',
  sideType: 'Single Sided',
  pageRangeStart: 1,
  pageRangeEnd: 50,
  studentPrice: 1.50,
  institutePrice: 1.50,
  regularPrice: 2.00
});

// Bulk create
const bulk = await adminAPI.bulkCreatePrintingPrices([
  { /* rule 1 */ },
  { /* rule 2 */ }
]);

// Update price
const updated = await adminAPI.updatePrintingPrice(id, {
  studentPrice: 1.60,
  regularPrice: 2.10
});

// Delete price
const deleted = await adminAPI.deletePrintingPrice(id);

// Get all prices
const all = await adminAPI.getPrintingPrices();

// Get prices by service type
const byType = await adminAPI.getPricesByServiceType('Normal Print');

// Get price for specific config
const forConfig = await adminAPI.getPriceForConfig({
  serviceType: 'Normal Print',
  colorType: 'Black & White',
  sideType: 'Single Sided',
  pageCount: 75
});
```

## Admin UI Features

### Pricing Management Page
Located at: `localhost:3000/admin/pricing`

**Features:**
1. **Initialize Defaults Button** - Creates default pricing rules (only visible if no rules exist)
2. **Add Price Rule Button** - Opens modal to add new pricing rules
3. **Conflict Detection** - Automatically checks for overlapping ranges before adding
4. **Edit Inline** - Click a rule to edit prices
5. **Delete** - Removes rules with confirmation
6. **Real-time Validation** - Validates page ranges and prices

### Conflict Detection Workflow
1. Admin fills in pricing rule details
2. Clicks "Add Price Rule"
3. System checks for conflicts using `/api/pricing/check/existing`
4. If conflicts found, shows confirmation dialog listing conflicts
5. Admin can proceed or cancel
6. Rules are created via `/api/pricing/bulk/create`

## Color & Side Type Mappings

### Color Types:
- **Backend:** `"Black & White"` → **Frontend:** `"bw"`
- **Backend:** `"Full Color"` → **Frontend:** `"color"`

### Side Types:
- **Backend:** `"Single Sided"` → **Frontend:** `"single"`
- **Backend:** `"Double Sided"` → **Frontend:** `"double"`

## Error Handling

### Common Errors:

**409 Conflict - Overlapping Range:**
```json
{
  "success": false,
  "message": "Price range overlaps with existing rule"
}
```

**400 Bad Request - Invalid Input:**
```json
{
  "success": false,
  "message": "Page range start must be less than or equal to end"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

**403 Forbidden - Not Admin:**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

## Testing the API

### Using Postman:

1. **Initialize Defaults:**
   - Method: POST
   - URL: `http://localhost:5000/api/pricing/init/defaults`
   - Headers: `Authorization: Bearer <admin_token>`

2. **Check Existing:**
   - Method: GET
   - URL: `http://localhost:5000/api/pricing/check/existing?serviceType=Normal%20Print&colorType=Black%20%26%20White&sideType=Single%20Sided`

3. **Create Rule:**
   - Method: POST
   - URL: `http://localhost:5000/api/pricing`
   - Headers: `Authorization: Bearer <admin_token>`
   - Body (JSON):
   ```json
   {
     "serviceType": "Normal Print",
     "colorType": "Black & White",
     "sideType": "Single Sided",
     "pageRangeStart": 1,
     "pageRangeEnd": 50,
     "studentPrice": 1.50,
     "institutePrice": 1.50,
     "regularPrice": 2.00
   }
   ```

## Workflow for Setting Up Pricing

### First Time Setup:
1. Login as admin
2. Go to Pricing Management page
3. Click "Initialize Defaults" button
4. Confirm the action
5. Default 5 pricing rules are created

### Adding Custom Rules:
1. Click "Add Price Rule"
2. Fill in the form (for multiple rules, click "+" to add more rows)
3. System automatically checks for conflicts
4. Confirm to create rules
5. Rules appear in table

### Modifying Existing Rules:
1. Click on a rule in the table to edit
2. Modify prices or description
3. Click Save icon to update
4. Click Cancel to discard changes

### Deleting Rules:
1. Click Delete icon on a rule
2. Confirm deletion
3. Rule is marked inactive (soft delete)

## Database Schema

### PrintingPrice Model:
```javascript
{
  _id: ObjectId,
  serviceType: String,
  colorType: String,
  sideType: String,
  pageRangeStart: Number,
  pageRangeEnd: Number,
  studentPrice: Number,
  institutePrice: Number,
  regularPrice: Number,
  description: String,
  createdBy: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Notes

- All price fields are stored as numbers (not strings)
- Page ranges can have gaps (not required to be continuous)
- Same rule cannot be applied to different service types yet (all use "Normal Print")
- Soft delete preserves pricing history
- Conflict detection happens before save to prevent overlapping ranges
