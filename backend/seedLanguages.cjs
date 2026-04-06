const mongoose = require('mongoose');
require('dotenv').config();

const Language = require('./models/Language.cjs');

const seedLanguages = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing languages
    await Language.deleteMany({});
    console.log('🗑️ Cleared existing languages');
    
    // Sample languages
    const languages = [
      { 
        fullName: 'English', 
        shortCode: 'EN', 
        isDefault: true, 
        isActive: true 
      },
      { 
        fullName: 'Hindi', 
        shortCode: 'HI', 
        isActive: true 
      },
      { 
        fullName: 'Spanish', 
        shortCode: 'ES', 
        isActive: true 
      },
      { 
        fullName: 'French', 
        shortCode: 'FR', 
        isActive: true 
      },
      { 
        fullName: 'German', 
        shortCode: 'DE', 
        isActive: true 
      },
      { 
        fullName: 'Arabic', 
        shortCode: 'AR', 
        isActive: true 
      }
    ];
    
    // Insert languages
    await Language.insertMany(languages);
    console.log(`✅ Created ${languages.length} languages`);
    
    // List all languages
    const allLanguages = await Language.find({}).sort({ fullName: 1 });
    console.log('🌐 Languages added:');
    allLanguages.forEach(language => {
      console.log(`  - ${language.fullName} (${language.shortCode})`);
    });
    
    await mongoose.disconnect();
    console.log('🎉 Languages seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedLanguages();
