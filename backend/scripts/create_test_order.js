const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Order = require('../api/models/Order');
const User = require('../api/models/User');
const db = require('../config/database');

async function main() {
  try {
    await db();
    const user = await User.findOne({ email: 'testuser1@example.com' });
    if (!user) {
      console.error('Test user not found');
      process.exit(1);
    }

    // Ensure uploads dir exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // Copy file (use workspace doc/README.md)
    const src = path.join(__dirname, '..', '..', 'doc', 'README.md');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(src);
    const dest = path.join(uploadsDir, unique);
    fs.copyFileSync(src, dest);

    const filesMeta = [
      {
        originalName: path.basename(src),
        filename: unique,
        mimeType: 'text/markdown',
        size: fs.statSync(dest).size,
        path: `/uploads/${unique}`,
      },
    ];

    const order = await Order.create({
      user: user._id,
      colorType: 'Color',
      sideType: 'Single',
      pageCount: 10,
      bindingType: '698e18c3105e0b3d20f4e73c',
      quantity: 2,
      totalPrice: 100,
      notes: 'Test order created by script',
      status: 'pending',
      paymentStatus: 'unpaid',
      items: [
        {
          description: '2x Color - Single Sided - 10 Pages',
          pricePerUnit: 50,
          quantity: 2,
        },
      ],
      files: filesMeta,
    });

    console.log('Created order with id:', order._id);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
