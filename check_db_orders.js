const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const Order = require('./backend/api/models/Order');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const query = { isActive: { $ne: false } };
        const count = await Order.countDocuments(query);
        console.log('Total orders meant to be shown:', count);

        const allCount = await Order.countDocuments({});
        console.log('Absolute total orders in DB:', allCount);

        if (count > 0) {
            const sample = await Order.findOne(query).lean();
            console.log('Sample order:', JSON.stringify(sample, null, 2));
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
