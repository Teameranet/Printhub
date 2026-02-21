require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function check() {
    try {
        console.log('Credentials:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'MISSING'
        });
        const result = await cloudinary.api.ping();
        console.log('Ping status: SUCCESS');
        console.log('Result:', result);
    } catch (error) {
        console.log('Ping status: FAILED');
        console.error('Error Details:', error.message);
        if (error.http_code) console.log('HTTP Code:', error.http_code);
    }
}

check();
