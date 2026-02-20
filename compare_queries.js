const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
const Order = require('./backend/api/models/Order');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('--- ADMIN QUERY (Expected) ---');
        console.log('Query: {}');
        const adminCount = await Order.countDocuments({});
        console.log('Count:', adminCount);

        console.log('--- EMPLOYEE QUERY ---');
        console.log('Query: { isActive: true }');
        const empCount = await Order.countDocuments({ isActive: true });
        console.log('Count:', empCount);

        // Check for specific fields
        const sample = await Order.findOne({}).lean();
        if (sample) {
            console.log('Sample isActive:', sample.isActive);
            if (sample.isActive === undefined) console.log('isActive is UNDEFINED in sample');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
check();
