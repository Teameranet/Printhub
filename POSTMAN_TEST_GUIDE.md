# Registration API - Postman Testing Guide

## Prerequisites
- MongoDB running on `mongodb://localhost:27017`
- Backend server running on `http://localhost:5000`

## Endpoints

### 1. Register User
**POST** `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "profileType": "Regular"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profileType": "Regular",
    "role": "user",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login User
**POST** `http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profileType": "Regular",
    "role": "user",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get Current User (Protected Route)
**GET** `http://localhost:5000/api/auth/me`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profileType": "Regular",
    "role": "user",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 4. Logout User (Protected Route)
**POST** `http://localhost:5000/api/auth/logout`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Testing Steps

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

3. **Test Registration** - Register a new user with POST request
4. **Copy the token** from the response
5. **Test Login** - Login with the registered credentials
6. **Test Get Current User** - Use the token in the Authorization header
7. **Test Logout** - Use the token in the Authorization header

## Error Responses

**Duplicate Email (409):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Invalid Credentials (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "No token provided or invalid format"
}
```

**Missing Fields (400):**
```json
{
  "success": false,
  "message": "Please provide all required fields (email, password, name, phone)"
}
```
