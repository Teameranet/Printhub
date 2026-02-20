const mongoose = require('mongoose');
const path = require('path');
// Load .env from backend directory (parent of scripts/)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Order = require('../api/models/Order');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in backend/.env');
            // Try to guess?
            return;
        }

        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');

        const count = await Order.countDocuments();
        console.log(`Total orders: ${count}`);

        const activeCount = await Order.countDocuments({ isActive: true });
        console.log(`Active orders: ${activeCount}`);

        const allOrders = await Order.find({}).limit(5);
        console.log('Recent 5 orders:', JSON.stringify(allOrders, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

connectDB();
