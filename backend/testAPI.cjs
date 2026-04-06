const mongoose = require('mongoose');
require('dotenv').config();

const testAPI = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB');
    
    const Country = require('./models/Country.cjs');
    
    // Check if countries exist
    const countryCount = await Country.countDocuments();
    console.log(`🌍 Countries in database: ${countryCount}`);
    
    if (countryCount > 0) {
      const countries = await Country.find({}).limit(5);
      console.log('Sample countries:');
      countries.forEach(country => {
        console.log(`  - ${country.name} (${country.code})`);
      });
    }
    
    // Test the API endpoint format
    console.log('\n🔍 Testing API response format...');
    const sampleCountry = await Country.findOne({});
    if (sampleCountry) {
      console.log('Sample country object:', JSON.stringify(sampleCountry, null, 2));
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAPI();
