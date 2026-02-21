const mongoose = require('mongoose');
const User = require('../api/models/User');
require('dotenv').config();

const users = [
    {
        name: 'Akash Admin',
        email: 'akash@admin.com',
        password: 'password123',
        phone: '81809 94970',
        role: 'admin',
        profileType: 'Staff'
    },
    {
        name: 'Printhub Employee',
        email: 'employee@printhub.com',
        password: 'password123',
        phone: '9021962276',
        role: 'employee',
        profileType: 'Staff'
    },
    {
        name: 'Indian Customer',
        email: 'user@printhub.com',
        password: 'password123',
        phone: '9876543210',
        role: 'user',
        profileType: 'Regular'
    }
];

const seedUsers = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (uri.includes('<db_password>')) {
            console.error('❌ ERROR: You still have <db_password> in your .env file.');
            console.error('Please replace it with your actual password from MongoDB Atlas first.');
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log('Connected to MongoDB...');

        for (const u of users) {
            const existingUser = await User.findOne({ email: u.email });
            if (existingUser) {
                console.log(`User ${u.email} already exists, updating...`);
                Object.assign(existingUser, u);
                await existingUser.save();
            } else {
                console.log(`Creating user ${u.email}...`);
                await User.create(u);
            }
        }

        console.log('✅ Status: Users seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
