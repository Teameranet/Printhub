const mongoose = require('mongoose');
const User = require('../api/models/User');
const Order = require('../api/models/Order');
const jwt = require('jsonwebtoken');
const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function debug() {
    try {
        console.log('Connecting to DB...', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find admin or any user to promote to admin for testing
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('No admin user found! Checking for any user...');
            admin = await User.findOne({});
            if (admin) {
                console.log(`Found user ${admin.email}, using them (assuming they are authorized or backend allows)`);
                // We are just testing the API with a valid token. If role check fails, we'll see 403.
            } else {
                console.log('No users found at all.');
                process.exit(1);
            }
        }
        console.log('Using user:', admin.email, 'Role:', admin.role);

        // Generate token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated token');

        // Make request
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/admin/orders?page=1&limit=10',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        console.log('Sending request to http://localhost:5000/api/admin/orders?page=1&limit=10');
        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log('Response JSON keys:', Object.keys(json));
                    if (json.data) {
                        console.log('Orders count in data:', Array.isArray(json.data) ? json.data.length : 'Not an array');
                        if (Array.isArray(json.data) && json.data.length > 0) {
                            console.log('First order sample:', JSON.stringify(json.data[0], null, 2));
                            // Check specifically for user population
                            console.log('User field in first order:', json.data[0].user);
                        } else if (!Array.isArray(json.data)) {
                            console.log('Data field is:', json.data);
                        }
                    } else {
                        console.log('Full response:', data);
                    }
                } catch (e) {
                    console.log('Response (not JSON):', data);
                }
                mongoose.disconnect();
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            mongoose.disconnect();
        });

        req.end();

    } catch (err) {
        console.error(err);
        if (mongoose.connection) mongoose.disconnect();
    }
}

debug();
