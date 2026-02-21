require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
    try {
        console.log('Starting test upload...');
        const result = await cloudinary.uploader.upload('c:\\FullStack__New\\Project\\Printduf\\Printhub_logo.png', {
            folder: 'test-folder',
        });
        console.log('Upload Success:', result.secure_url);
    } catch (error) {
        console.error('Upload Failed:', error);
    }
}

testUpload();
