/**
 * Seeds default data needed for normal print orders:
 * - BindingType "None" (required for orders with no binding)
 * - Optional: one PrintingPrice rule so price calculation works before admin sets pricing
 */
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const BindingType = require(path.join(__dirname, '..', 'api', 'models', 'BindingType'));
const PrintingPrice = require(path.join(__dirname, '..', 'api', 'models', 'PrintingPrice'));
const User = require(path.join(__dirname, '..', 'api', 'models', 'User'));

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seed');

    // 1. Ensure "None" binding type exists
    let noneBinding = await BindingType.findOne({ name: 'None' });
    if (!noneBinding) {
      noneBinding = await BindingType.create({ name: 'None', isActive: true });
      console.log('Created BindingType "None"');
    } else {
      console.log('BindingType "None" already exists');
    }

    // 2. If no PrintingPrice rules exist, create one so calculate/price works
    const priceCount = await PrintingPrice.countDocuments({ isActive: true });
    if (priceCount === 0) {
      const firstUser = await User.findOne().select('_id');
      const priceData = {
        serviceType: 'Normal Print',
        colorType: 'Black & White',
        sideType: 'Single Sided',
        pageRangeStart: 1,
        pageRangeEnd: 10000,
        studentPrice: 2,
        institutePrice: 2,
        regularPrice: 2,
        isActive: true,
      };
      
      // Add createdBy if user exists, otherwise skip (some schemas require it)
      if (firstUser) {
        priceData.createdBy = firstUser._id;
      }
      
      try {
        await PrintingPrice.create(priceData);
        console.log('✅ Created default PrintingPrice (B&W, Single Sided, 1-10000 pages, ₹2/page)');
      } catch (err) {
        if (err.message.includes('createdBy')) {
          console.log('⚠️  No user found. Please register/login first, then run this script again.');
          console.log('   Or create pricing rules manually via Admin Panel → Pricing Management');
        } else {
          throw err;
        }
      }
    } else {
      console.log(`✅ Found ${priceCount} existing pricing rule(s)`);
    }

    console.log('Seed completed.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
