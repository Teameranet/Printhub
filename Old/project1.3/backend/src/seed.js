const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: "Business Cards",
    description: "High-quality custom business cards, perfect for networking.",
    price: 29.99,
    category: "Printing",
    image: "/products/business-cards.jpg",
    stock: 100
  },
  {
    name: "Vinyl Banners",
    description: "Durable vinyl banners for indoor and outdoor advertising.",
    price: 49.99,
    category: "Signage",
    image: "/products/banners.jpg",
    stock: 50
  },
  {
    name: "Custom T-Shirts",
    description: "Personalized t-shirts with your design, perfect for events or branding.",
    price: 19.99,
    category: "Apparel",
    image: "/products/tshirts.jpg",
    stock: 200
  },
  {
    name: "Tri-Fold Brochures",
    description: "Informative and visually appealing brochures for marketing.",
    price: 35.00,
    category: "Printing",
    image: "/products/brochures.jpg",
    stock: 150
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/printhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');

    await Product.deleteMany({}); // Clear existing products
    console.log('Existing products cleared');

    await Product.insertMany(products);
    console.log('Products seeded successfully!');

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB(); 