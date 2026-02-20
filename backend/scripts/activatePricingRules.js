/**
 * Activate all pricing rules in the database
 * Run: node scripts/activatePricingRules.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const PrintingPrice = require(path.join(__dirname, '..', 'api', 'models', 'PrintingPrice'));

const activateRules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Activate all pricing rules
    const result = await PrintingPrice.updateMany(
      { isActive: false },
      { $set: { isActive: true } }
    );

    console.log(`✅ Activated ${result.modifiedCount} pricing rules`);

    // Verify
    const activeCount = await PrintingPrice.countDocuments({ isActive: true });
    const inactiveCount = await PrintingPrice.countDocuments({ isActive: false });
    
    console.log(`📊 Active rules: ${activeCount}`);
    console.log(`📊 Inactive rules: ${inactiveCount}`);

    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

activateRules();
