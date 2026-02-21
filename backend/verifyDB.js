const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ DB Connected SUCCESS');
        process.exit(0);
    } catch (error) {
        console.log('❌ DB Connection FAILED');
        console.error(error.message);
        process.exit(1);
    }
}

check();
