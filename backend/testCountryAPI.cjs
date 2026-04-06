const mongoose = require('mongoose');
require('dotenv').config();

const testCountryAPI = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Simulate the API call
    const Country = require('./models/Country.cjs');
    
    const countries = await Country.find({
      isActive: true,
    }, {
      name: 1, _id: 1
    }).sort({ name: 1 });

    // Transform to match frontend expectations
    const transformedCountries = countries.map(country => ({
      _id: country._id,
      name: country.name,
      country_name: country.name
    }));

    console.log('🌍 API Response Format:');
    console.log(JSON.stringify({
      success: true,
      message: "Countries fetched successfully",
      data: transformedCountries
    }, null, 2));
    
    await mongoose.disconnect();
    console.log('✅ API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testCountryAPI();
