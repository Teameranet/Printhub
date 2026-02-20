const mongoose = require('mongoose');
require('dotenv').config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/printhub');
    
    // Drop old indexes and collection
    const db = mongoose.connection;
    const collection = db.collection('orders');
    
    try {
      await collection.dropIndexes();
      console.log('✅ Old indexes dropped');
    } catch (e) {
      console.log('ℹ️ No indexes to drop');
    }
    
    // Delete all documents
    const result = await collection.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} documents`);
    
    await mongoose.connection.close();
    console.log('✅ Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

cleanup();
