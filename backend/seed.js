/**
 * MongoDB Seed Script for PrintHub
 * 
 * This script populates the database with initial data including:
 * - Default admin user
 * - Pricing rules
 * - Binding types and prices
 * - Advanced services
 * - System settings
 * 
 * Usage: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printhub_db';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define Schemas (simplified for seeding)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  profileType: { type: String, enum: ['Regular', 'Student', 'Institute'], default: 'Regular' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const pricingRuleSchema = new mongoose.Schema({
  ruleName: String,
  colorType: { type: String, enum: ['bw', 'color'] },
  sideType: { type: String, enum: ['single', 'double'] },
  fromPage: Number,
  toPage: Number,
  regularPrice: Number,
  studentPrice: Number,
  institutePrice: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

co