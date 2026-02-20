# Printing Price Management Module - API Guide

## Overview
This module manages detailed printing prices with support for:
- Multiple service types (Normal Print, Advanced Print, Binding, etc.)
- Color options (Black & White, Full Color)
- Side options (Single Sided, Double Sided)
- Page range pricing
- Multiple user categories (Student, Institute, Regular)

---

## PUBLIC ENDPOINTS (No Authentication Required)

### 1. Get All Printing Prices
**GET** `http://localhost:5000/api/pricing?serviceType=Normal Print&colorType=Black & White`

**Query Parameters (optional):**
- `serviceType` - Filter by service type
- `colorType` - Filter by color type
- `sideType` - Filter by side type
- `isActive` - true/false

**Response (200):**
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
      "description": "Standard B&W single sided printing",
      "isActive": true,
      "createdBy": {
        "_id": "...",
        "name": "Admin",
        "email": "admin@printhub.com"
      },
      "createdAt": "2026-02-11T10:30:00.000Z",
      "updatedAt": "2026-02-11T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 51,
      "pageRangeEnd": 200,
      "studentPrice": 1.25,
      "institutePrice": 1.25,
      "regularPrice": 1.75,
      "description": "Standard B&W single sided - bulk",
      ...
    }
  ],
  "count": 2
}
```

---

### 2. Get Prices by Service Type
**GET** `http://localhost:5000/api/pricing/by-service/Normal Print`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 1.50,
      "institutePrice": 1.50,
      "regularPrice": 2.00,
      ...
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Double Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 1.20,
      "institutePrice": 1.20,
      "regularPrice": 1.60,
      ...
    }
  ]
}
```

---

### 3. Get Price for Specific Configuration
**GET** `http://localhost:5000/api/pricing/config?serviceType=Normal Print&colorType=Black & White&sideType=Single Sided&pageCount=25`

**Query Parameters (required):**
- `serviceType` - Service type (Normal Print, Advanced Print, etc.)
- `colorType` - Color type (Black & White, Full Color)
- `sideType` - Side type (Single Sided, Double Sided)
- `pageCount` - Number of pages

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 1,
    "pageRangeEnd": 50,
    "studentPrice": 1.50,
    "institutePrice": 1.50,
    "regularPrice": 2.00,
    "description": "Standard B&W single sided printing"
  }
}
```

---

## ADMIN ENDPOINTS (Authentication & Admin Role Required)

### 4. Create Printing Price Rule
**POST** `http://localhost:5000/api/pricing`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body (JSON):**
```json
{
  "serviceType": "Normal Print",
  "colorType": "Black & White",
  "sideType": "Single Sided",
  "pageRangeStart": 1,
  "pageRangeEnd": 50,
  "studentPrice": 1.50,
  "institutePrice": 1.50,
  "regularPrice": 2.00,
  "description": "Standard B&W single sided printing"
}
```

**Valid Values:**
- **serviceType**: "Normal Print", "Advanced Print", "Binding", "Lamination", "Spiral Binding"
- **colorType**: "Black & White", "Full Color", "Both"
- **sideType**: "Single Sided", "Double Sided", "Both"

**Response (201):**
```json
{
  "success": true,
  "message": "Pricing rule created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "serviceType": "Normal Print",
    "colorType": "Black & White",
    "sideType": "Single Sided",
    "pageRangeStart": 1,
    "pageRangeEnd": 50,
    "studentPrice": 1.50,
    "institutePrice": 1.50,
    "regularPrice": 2.00,
    "createdBy": "...",
    "isActive": true,
    "createdAt": "2026-02-11T10:30:00.000Z",
    "updatedAt": "2026-02-11T10:30:00.000Z"
  }
}
```

---

### 5. Bulk Create Pricing Rules
**POST** `http://localhost:5000/api/pricing/bulk/create`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body (JSON):**
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
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 51,
      "pageRangeEnd": 200,
      "studentPrice": 1.25,
      "institutePrice": 1.25,
      "regularPrice": 1.75
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Full Color",
      "sideType": "Single Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 8.00,
      "institutePrice": 8.00,
      "regularPrice": 10.00
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "3 pricing rules created successfully",
  "data": [...]
}
```

---

### 6. Update Pricing Rule
**PUT** `http://localhost:5000/api/pricing/507f1f77bcf86cd799439011`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body (JSON):**
```json
{
  "studentPrice": 1.60,
  "institutePrice": 1.60,
  "regularPrice": 2.10,
  "description": "Updated standard B&W single sided printing"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pricing rule updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "studentPrice": 1.60,
    "institutePrice": 1.60,
    "regularPrice": 2.10,
    ...
  }
}
```

---

### 7. Delete Pricing Rule
**DELETE** `http://localhost:5000/api/pricing/507f1f77bcf86cd799439011`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pricing rule deleted successfully",
  "data": {
    "isActive": false,
    ...
  }
}
```

---

## Sample Pricing Structure for Normal Printing

### Complete Pricing Table
```
SERVICE: Normal Print

| Colour    | Sides  | Pages 1-50 | Pages 51-200 | Pages 201+ |
|-----------|--------|------------|--------------|------------|
| B&W       | Single | ₹2.00      | ₹1.75        | ₹1.50      |
| B&W       | Double | ₹1.60      | ₹1.40        | ₹1.20      |
| Full Color| Single | ₹10.00     | ₹9.00        | ₹8.00      |
| Full Color| Double | ₹9.00      | ₹8.00        | ₹7.00      |
```

### Copy-Paste Bulk Creation JSON
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
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 51,
      "pageRangeEnd": 200,
      "studentPrice": 1.25,
      "institutePrice": 1.25,
      "regularPrice": 1.75
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Single Sided",
      "pageRangeStart": 201,
      "pageRangeEnd": 1000,
      "studentPrice": 1.00,
      "institutePrice": 1.00,
      "regularPrice": 1.50
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Double Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 1.20,
      "institutePrice": 1.20,
      "regularPrice": 1.60
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Black & White",
      "sideType": "Double Sided",
      "pageRangeStart": 51,
      "pageRangeEnd": 200,
      "studentPrice": 1.00,
      "institutePrice": 1.00,
      "regularPrice": 1.40
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Full Color",
      "sideType": "Single Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 8.00,
      "institutePrice": 8.00,
      "regularPrice": 10.00
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Full Color",
      "sideType": "Single Sided",
      "pageRangeStart": 51,
      "pageRangeEnd": 200,
      "studentPrice": 7.00,
      "institutePrice": 7.00,
      "regularPrice": 9.00
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Full Color",
      "sideType": "Double Sided",
      "pageRangeStart": 1,
      "pageRangeEnd": 50,
      "studentPrice": 7.00,
      "institutePrice": 7.00,
      "regularPrice": 9.00
    },
    {
      "serviceType": "Normal Print",
      "colorType": "Full Color",
      "sideType": "Double Sided",
      "pageRangeStart": 51,
      "pageRangeEnd": 200,
      "studentPrice": 6.00,
      "institutePrice": 6.00,
      "regularPrice": 8.00
    }
  ]
}
```

---

## Testing Steps

1. **Register Admin User**
   - POST `/api/auth/register`
   - Update role to 'admin' in MongoDB

2. **Login as Admin**
   - POST `/api/auth/login`
   - Copy the token

3. **Test Public Endpoints**
   - GET `/api/pricing` - Should return empty initially
   - GET `/api/pricing/by-service/Normal Print` - Should return 404

4. **Create Pricing Rules**
   - POST `/api/pricing` with single rule OR
   - POST `/api/pricing/bulk/create` with multiple rules

5. **Verify Prices**
   - GET `/api/pricing?serviceType=Normal Print`
   - GET `/api/pricing/config?serviceType=Normal Print&colorType=Black & White&sideType=Single Sided&pageCount=25`

---

## Error Responses

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "No token provided or invalid format"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin only."
}
```

**Bad Request (400):**
```json
{
  "success": false,
  "message": "Page range start must be less than or equal to end"
}
```

**Overlap Error (409):**
```json
{
  "success": false,
  "message": "Price range overlaps with existing rule"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "No pricing found for Normal Print"
}
```
