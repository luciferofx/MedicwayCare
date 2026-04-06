const mongoose = require('mongoose');
require('dotenv').config();

const Country = require('./models/Country.cjs');

const seedCountries = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing countries
    await Country.deleteMany({});
    console.log('🗑️ Cleared existing countries');
    
    // Sample countries
    const countries = [
      { 
        name: 'India', 
        code: 'IN', 
        currency: 'INR', 
        timezone: 'Asia/Kolkata', 
        isActive: true 
      },
      { 
        name: 'United States', 
        code: 'US', 
        currency: 'USD', 
        timezone: 'America/New_York', 
        isActive: true 
      },
      { 
        name: 'United Kingdom', 
        code: 'GB', 
        currency: 'GBP', 
        timezone: 'Europe/London', 
        isActive: true 
      },
      { 
        name: 'Canada', 
        code: 'CA', 
        currency: 'CAD', 
        timezone: 'America/Toronto', 
        isActive: true 
      },
      { 
        name: 'Australia', 
        code: 'AU', 
        currency: 'AUD', 
        timezone: 'Australia/Sydney', 
        isActive: true 
      },
      { 
        name: 'Germany', 
        code: 'DE', 
        currency: 'EUR', 
        timezone: 'Europe/Berlin', 
        isActive: true 
      },
      { 
        name: 'France', 
        code: 'FR', 
        currency: 'EUR', 
        timezone: 'Europe/Paris', 
        isActive: true 
      },
      { 
        name: 'Japan', 
        code: 'JP', 
        currency: 'JPY', 
        timezone: 'Asia/Tokyo', 
        isActive: true 
      },
      { 
        name: 'Singapore', 
        code: 'SG', 
        currency: 'SGD', 
        timezone: 'Asia/Singapore', 
        isActive: true 
      },
      { 
        name: 'UAE', 
        code: 'AE', 
        currency: 'AED', 
        timezone: 'Asia/Dubai', 
        isActive: true 
      }
    ];
    
    // Insert countries
    await Country.insertMany(countries);
    console.log(`✅ Created ${countries.length} countries`);
    
    // List all countries
    const allCountries = await Country.find({}).sort({ name: 1 });
    console.log('🌍 Countries added:');
    allCountries.forEach(country => {
      console.log(`  - ${country.name} (${country.code})`);
    });
    
    await mongoose.disconnect();
    console.log('🎉 Countries seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedCountries();
