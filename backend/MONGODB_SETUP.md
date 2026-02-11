# MongoDB Setup Guide for PrintHub

## Overview
This guide will help you set up MongoDB for the PrintHub application with all necessary collections, indexes, and initial data.

## Prerequisites
- MongoDB installed locally or MongoDB Atlas account
- Node.js and npm installed
- Basic understanding of MongoDB and Mongoose

## Quick Start

### 1. Install Required Packages
```bash
cd backend
npm install mongoose dotenv bcryptjs
```

### 2. Configure Environment Variables
Create or update `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/printhub_db
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/printhub_db

JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Database Connection
The MongoDB schema is defined in `mongodb-schema.json`. Use this as a reference for your Mongoose models.

## Collections Overview

### 1. **users** - User Authentication & Profiles
- Stores user account information
- Supports three profile types: Regular, Student, Institute
- Includes admin role support
- Indexes: email (unique), phone (unique), createdAt

### 2. **orders** - Print Orders
- Complete order information with file details
- Supports both Normal and Advanced print types
- Tracks order status through lifecycle
- Includes delivery/pickup information
- Indexes: userId, status, orderNumber (unique), createdAt

### 3. **pricing_rules** - Dynamic Pricing
- Configurable pricing based on:
  - Color type (B&W or Color)
  - Side type (Single or Double)
  - Page ranges
  - User profile type (Regular/Student/Institute)
- Indexes: colorType + sideType, isActive

### 4. **binding_types** - Binding Options
- Available binding types (Spiral, Staple, Hardcover, etc.)
- Can be enabled/disabled dynamically
- Indexes: bindingId (unique), isActive

### 5. **binding_prices** - Binding Pricing
- Pricing rules for binding services
- Based on page ranges and user types
- Indexes: bindingTypeId, isActive

### 6. **advanced_services** - Advanced Print Services
- Catalog of specialized printing services
- Includes letterheads, posters, business cards, etc.
- Indexes: serviceId (unique), isActive, popular

### 7. **cart_items** - Shopping Cart (Optional)
- Temporary storage for cart items
- TTL index for automatic cleanup after 7 days
- Alternative: Use session storage on frontend

### 8. **file_uploads** - File Metadata
- Tracks uploaded files and their storage locations
- Links files to users and orders
- Stores cloud storage URLs (S3, Cloudinary, etc.)
- Indexes: userId, orderId, createdAt

### 9. **system_settings** - Configuration
- Global system settings
- Store information, business hours, etc.
- Key-value structure for flexibility
- Index: key (unique)

### 10. **audit_logs** - Activity Tracking
- Audit trail for important system actions
- Tracks changes to orders, users, pricing
- Indexes: userId, action, timestamp

## Initial Data Setup

### Default Admin User
```javascript
{
  name: "Admin User",
  email: "admin@printhub.com",
  phone: "9999999999",
  password: "hashed_password", // Use bcrypt
  profileType: "Regular",
  role: "admin",
  isVerified: true,
  isActive: true
}
```

### Default Pricing Rules
```javascript
// B&W Single-Sided
{ colorType: "bw", sideType: "single", fromPage: 1, toPage: 50, 
  regularPrice: 2, studentPrice: 1.5, institutePrice: 1.2 }

// B&W Double-Sided
{ colorType: "bw", sideType: "double", fromPage: 1, toPage: 50,
  regularPrice: 1.5, studentPrice: 1.2, institutePrice: 1 }

// Color Single-Sided
{ colorType: "color", sideType: "single", fromPage: 1, toPage: 50,
  regularPrice: 10, studentPrice: 8, institutePrice: 7 }

// Color Double-Sided
{ colorType: "color", sideType: "double", fromPage: 1, toPage: 50,
  regularPrice: 8, studentPrice: 6.5, institutePrice: 5.5 }
```

### Default Binding Types
```javascript
[
  { bindingId: "none", name: "None", isActive: true },
  { bindingId: "spiral", name: "Spiral Binding", isActive: true },
  { bindingId: "staple", name: "Staple", isActive: true },
  { bindingId: "hardcover", name: "Hardcover", isActive: true }
]
```

### Default Binding Prices
```javascript
// Spiral Binding
{ bindingTypeId: "spiral", fromPage: 1, toPage: 100,
  regularPrice: 20, studentPrice: 15, institutePrice: 12 }

// Staple
{ bindingTypeId: "staple", fromPage: 1, toPage: 50,
  regularPrice: 5, studentPrice: 4, institutePrice: 3 }

// Hardcover
{ bindingTypeId: "hardcover", fromPage: 1, toPage: 200,
  regularPrice: 100, studentPrice: 80, institutePrice: 70 }
```

### Store Information
```javascript
{
  key: "store_info",
  value: {
    name: "PrintHub Central Store",
    address: "Dehu Phata, Alandi - Moshi Rd, opp. Anand Hospital, Alandi, Devachi, Maharashtra 412105",
    phone: "1234567890",
    email: "info@printhub.com",
    hours: "9:00 AM - 9:00 PM",
    estimatedReadyTime: "2-4 Hours"
  },
  category: "general"
}
```

## API Endpoints to Implement

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (with filters)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (admin)
- `GET /api/orders/user/:userId` - Get user's orders

### Pricing
- `GET /api/pricing/rules` - Get all pricing rules
- `POST /api/pricing/rules` - Create pricing rule (admin)
- `PUT /api/pricing/rules/:id` - Update pricing rule (admin)
- `DELETE /api/pricing/rules/:id` - Delete pricing rule (admin)
- `POST /api/pricing/calculate` - Calculate price for order

### Binding
- `GET /api/binding/types` - Get all binding types
- `POST /api/binding/types` - Create binding type (admin)
- `PUT /api/binding/types/:id` - Update binding type (admin)
- `GET /api/binding/prices` - Get binding prices
- `POST /api/binding/prices` - Create binding price (admin)

### Advanced Services
- `GET /api/services` - Get all advanced services
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### File Upload
- `POST /api/upload` - Upload file
- `GET /api/upload/:fileId` - Get file metadata
- `DELETE /api/upload/:fileId` - Delete file

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/:key` - Get setting by key
- `PUT /api/settings/:key` - Update setting (admin)

## Security Best Practices

1. **Password Hashing**: Always use bcrypt with salt rounds >= 10
2. **JWT Tokens**: Use secure, long secret keys and set appropriate expiration
3. **Input Validation**: Validate all user inputs using Joi or express-validator
4. **Rate Limiting**: Implement rate limiting on authentication endpoints
5. **CORS**: Configure CORS properly for production
6. **File Upload**: Validate file types, sizes, and scan for malware
7. **Environment Variables**: Never commit .env files to version control

## Performance Optimization

1. **Indexes**: All important indexes are defined in the schema
2. **Pagination**: Implement pagination for list endpoints
3. **Caching**: Use Redis for frequently accessed data
4. **File Storage**: Use cloud storage (S3, Cloudinary) for files
5. **Database Queries**: Use projection to fetch only required fields
6. **Aggregation**: Use MongoDB aggregation for complex reports

## Backup Strategy

1. **Automated Backups**: Schedule daily backups
2. **Retention Policy**: Keep backups for at least 30 days
3. **Test Restores**: Regularly test backup restoration
4. **Off-site Storage**: Store backups in different location/region

## Monitoring

1. **Database Metrics**: Monitor query performance, connection pool
2. **Error Logging**: Implement comprehensive error logging
3. **Alerts**: Set up alerts for critical issues
4. **Analytics**: Track order patterns, user behavior

## Migration from localStorage

The current frontend uses localStorage for temporary data. To migrate:

1. **Users**: Sync localStorage users to MongoDB on first login
2. **Orders**: Import historical orders with proper user association
3. **Pricing**: Replace localStorage pricing with database queries
4. **Cart**: Optionally migrate to database or keep in localStorage

## Testing

1. **Unit Tests**: Test individual models and controllers
2. **Integration Tests**: Test API endpoints
3. **Load Tests**: Test database performance under load
4. **Data Validation**: Test schema validation rules

## Next Steps

1. Create Mongoose models based on the schema
2. Implement database connection in server.js
3. Create API routes and controllers
4. Add authentication middleware
5. Implement file upload functionality
6. Add data validation
7. Create seed script for initial data
8. Test all endpoints
9. Deploy to production

## Support

For questions or issues:
- Check MongoDB documentation: https://docs.mongodb.com/
- Mongoose documentation: https://mongoosejs.com/
- Review the schema file: `mongodb-schema.json`
