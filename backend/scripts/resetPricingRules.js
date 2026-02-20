/**
 * Reset and create professional pricing rules
 * This removes all existing rules and creates a clean set of active pricing rules
 * Run: node scripts/resetPricingRules.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const PrintingPrice = require(path.join(__dirname, '..', 'api', 'models', 'PrintingPrice'));
const User = require(path.join(__dirname, '..', 'api', 'models', 'User'));

const resetAndCreateRules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Get first user for createdBy field
    const firstUser = await User.findOne().select('_id');
    if (!firstUser) {
      console.error('❌ No user found. Please register/login first, then run this script again.');
      process.exit(1);
    }

    // Delete all existing pricing rules
    const deleteResult = await PrintingPrice.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing pricing rules`);

    // Professional pricing rules - covering common scenarios
    const professionalRules = [
      // Black & White - Single Sided
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Single Sided',
        pageRangeStart: 1,
        pageRangeEnd: 50,
        studentPrice: 1.50,
        institutePrice: 1.50,
        regularPrice: 2.00,
        description: 'B&W Single Sided 1-50 pages',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Single Sided',
        pageRangeStart: 51,
        pageRangeEnd: 200,
        studentPrice: 1.25,
        institutePrice: 1.25,
        regularPrice: 1.75,
        description: 'B&W Single Sided 51-200 pages (bulk discount)',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Single Sided',
        pageRangeStart: 201,
        pageRangeEnd: 1000,
        studentPrice: 1.00,
        institutePrice: 1.00,
        regularPrice: 1.50,
        description: 'B&W Single Sided 201-1000 pages (large bulk)',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Single Sided',
        pageRangeStart: 1001,
        pageRangeEnd: 10000,
        studentPrice: 0.75,
        institutePrice: 0.75,
        regularPrice: 1.25,
        description: 'B&W Single Sided 1001+ pages (very large bulk)',
        createdBy: firstUser._id,
        isActive: true,
      },

      // Black & White - Double Sided
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Double Sided',
        pageRangeStart: 1,
        pageRangeEnd: 50,
        studentPrice: 1.20,
        institutePrice: 1.20,
        regularPrice: 1.60,
        description: 'B&W Double Sided 1-50 pages',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Double Sided',
        pageRangeStart: 51,
        pageRangeEnd: 200,
        studentPrice: 1.00,
        institutePrice: 1.00,
        regularPrice: 1.40,
        description: 'B&W Double Sided 51-200 pages (bulk discount)',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Double Sided',
        pageRangeStart: 201,
        pageRangeEnd: 1000,
        studentPrice: 0.80,
        institutePrice: 0.80,
        regularPrice: 1.20,
        description: 'B&W Double Sided 201-1000 pages (large bulk)',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Double Sided',
        pageRangeStart: 1001,
        pageRangeEnd: 10000,
        studentPrice: 0.60,
        institutePrice: 0.60,
        regularPrice: 1.00,
        description: 'B&W Double Sided 1001+ pages (very large bulk)',
        createdBy: firstUser._id,
        isActive: true,
      },

      // Full Color - Single Sided
      {
        serviceType: 'Normal Print',
        colorType: 'Full Color',
        sideType: 'Single Sided',
        pageRangeStart: 1,
        pageRangeEnd: 50,
        studentPrice: 8.00,
        institutePrice: 8.00,
        regularPrice: 10.00,
        description: 'Color Single Sided 1-50 pages',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Full Color',
        sideType: 'Single Sided',
        pageRangeStart: 51,
        pageRangeEnd: 200,
        studentPrice: 7.00,
        institutePrice: 7.00,
        regularPrice: 9.00,
        description: 'Color Single Sided 51-200 pages (bulk discount)',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Full Color',
        sideType: 'Single Sided',
        pageRangeStart: 201,
        pageRangeEnd: 1000,
        studentPrice: 6.00,
        institutePrice: 6.00,
        regularPrice: 8.00,
        description: 'Color Single Sided 201-1000 pages (large bulk)',
        createdBy: firstUser._id,
        isActive: true,
      },

      // Full Color - Double Sided
      {
        serviceType: 'Normal Print',
        colorType: 'Full Color',
        sideType: 'Double Sided',
        pageRangeStart: 1,
        pageRangeEnd: 50,
        studentPrice: 7.00,
        institutePrice: 7.00,
        regularPrice: 9.00,
        description: 'Color Double Sided 1-50 pages',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Full Color',
        sideType: 'Double Sided',
        pageRangeStart: 51,
        pageRangeEnd: 200,
        studentPrice: 6.00,
        institutePrice: 6.00,
        regularPrice: 8.00,
        description: 'Color Double Sided 51-200 pages (bulk discount)',
        createdBy: firstUser._id,
        isActive: true,
      },
      {
        serviceType: 'Normal Print',
        colorType: 'Full Color',
        sideType: 'Double Sided',
        pageRangeStart: 201,
        pageRangeEnd: 1000,
        studentPrice: 5.00,
        institutePrice: 5.00,
        regularPrice: 7.00,
        description: 'Color Double Sided 201-1000 pages (large bulk)',
        createdBy: firstUser._id,
        isActive: true,
      },
    ];

    // Insert all rules
    const created = await PrintingPrice.insertMany(professionalRules);

    console.log(`✅ Created ${created.length} professional pricing rules`);
    console.log('\n📊 Pricing Rules Summary:');
    console.log(`   - Black & White Single Sided: 4 rules (1-50, 51-200, 201-1000, 1001+)`);
    console.log(`   - Black & White Double Sided: 4 rules (1-50, 51-200, 201-1000, 1001+)`);
    console.log(`   - Full Color Single Sided: 3 rules (1-50, 51-200, 201-1000)`);
    console.log(`   - Full Color Double Sided: 3 rules (1-50, 51-200, 201-1000)`);
    console.log('\n✅ All rules are ACTIVE and ready to use!');

    // Verify
    const activeCount = await PrintingPrice.countDocuments({ isActive: true });
    console.log(`\n📈 Total active rules: ${activeCount}`);

    console.log('\n✅ Reset complete! Price calculation should work now.');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetAndCreateRules();
