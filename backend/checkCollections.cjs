const mongoose = require('mongoose');
require('dotenv').config();

const checkCollections = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Collection Status:\n');
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`${count.toString().padStart(3, ' ')} documents - ${collection.name}`);
    }
    
    // Check specifically for doctor and hospital data
    console.log('\n🔍 Looking for doctor data:');
    const doctorCollections = ['doctors', 'doctor11', 'doctor', 'doctor1s'];
    for (const name of doctorCollections) {
      if (collections.find(c => c.name === name)) {
        const count = await db.collection(name).countDocuments();
        console.log(`  - ${name}: ${count} documents`);
      }
    }
    
    console.log('\n🔍 Looking for hospital data:');
    const hospitalCollections = ['hospitals', 'hospital11', 'hospital', 'hospital1s'];
    for (const name of hospitalCollections) {
      if (collections.find(c => c.name === name)) {
        const count = await db.collection(name).countDocuments();
        console.log(`  - ${name}: ${count} documents`);
      }
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkCollections();
