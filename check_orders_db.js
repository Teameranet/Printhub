const mongoose = require('mongoose');
const Order = require('./backend/api/models/Order');
const User = require('./backend/api/models/User');
const BindingType = require('./backend/api/models/BindingType');
require('dotenv').config({ path: './backend/.env' });

async function checkOrders() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const count = await Order.countDocuments({});
        console.log('Total Orders in DB:', count);

        const activeCount = await Order.countDocuments({ isActive: { $ne: false } });
        console.log('Active Orders:', activeCount);

        const pendingCount = await Order.countDocuments({ status: 'pending' });
        console.log('Pending Orders:', pendingCount);

        const orders = await Order.find({}).limit(5).lean();
        console.log('First 5 orders:');
        console.log(JSON.stringify(orders, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkOrders();
