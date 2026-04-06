const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Hospital = require('./models/Hospital.cjs');
const Doctor = require('./models/Doctor.cjs');
const Country = require('./models/Country.cjs');
const Language = require('./models/Language.cjs');

// Use the new MongoDB connection
const MONGODB_URI = process.env.ATLAS_URI || 'mongodb://localhost:27017/healthcare';

const quickSeed = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');

    // Check existing collections and clear them
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));

    // Drop old problematic collections if they exist
    try {
      if (collections.find(c => c.name === 'doctor11s')) {
        await db.collection('doctor11s').drop();
        console.log('Dropped old doctor11s collection');
      }
      if (collections.find(c => c.name === 'hospital11s')) {
        await db.collection('hospital11s').drop();
        console.log('Dropped old hospital11s collection');
      }
    } catch (error) {
      console.log('Error dropping old collections:', error.message);
    }

    // Clear current collections
    try {
      await Hospital.collection.drop();
      await Doctor.collection.drop();
      await Country.collection.drop();
      await Language.collection.drop();
      console.log('Cleared current collections');
    } catch (error) {
      console.log('Collections might not exist, continuing...');
    }

    // Simple hospital data
    const hospitals = [
      { name: 'Apollo Hospitals', country: 'India', city: 'New Delhi', specialties: ['Cardiology', 'Oncology'], rating: 4.7, image: 'https://images.unsplash.com/photo-1576765607935-3c8b8bbaab9d?w=600&h=400&fit=crop', language: 'EN', isActive: true },
      { name: 'Fortis Hospital', country: 'India', city: 'Gurgaon', specialties: ['Orthopedics', 'Neurosciences'], rating: 4.6, image: 'https://images.unsplash.com/photo-1584982752564-3f6a3f6fadc7?w=600&h=400&fit=crop', language: 'EN', isActive: true },
      { name: 'AIIMS', country: 'India', city: 'New Delhi', specialties: ['General Medicine', 'Pediatrics'], rating: 4.9, image: 'https://images.unsplash.com/photo-1580281657521-6a9b02af1c2b?w=600&h=400&fit=crop', language: 'EN', isActive: true },
      { name: 'Max Super Specialty Hospital', country: 'India', city: 'Saket', specialties: ['Gastroenterology', 'Oncology'], rating: 4.5, image: 'https://images.unsplash.com/photo-1584982752564-3f6a3f6fadc7?w=600&h=400&fit=crop', language: 'EN', isActive: true },
      { name: 'Manipal Hospitals', country: 'India', city: 'Bangalore', specialties: ['Nephrology', 'Pulmonology'], rating: 4.4, image: 'https://images.unsplash.com/photo-1627856018303-3edddc3e8a2a?w=600&h=400&fit=crop', language: 'EN', isActive: true }
    ];

    // Simple doctor data
    const doctors = [
      { firstName: 'Rahul', lastName: 'Sharma', fullName: 'Dr. Rahul Sharma', specialty: 'Cardiologist', consultationFee: 500, rating: 4.8, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop', experience: 5, languages: ['English'], bio: 'Experienced Cardiologist at Apollo Hospitals', isActive: true },
      { firstName: 'Meera', lastName: 'Kapoor', fullName: 'Dr. Meera Kapoor', specialty: 'Orthopedic Surgeon', consultationFee: 600, rating: 4.6, image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=800&auto=format&fit=crop', experience: 7, languages: ['English'], bio: 'Experienced Orthopedic Surgeon at Fortis Hospital', isActive: true },
      { firstName: 'Anil', lastName: 'Verma', fullName: 'Dr. Anil Verma', specialty: 'Neurologist', consultationFee: 550, rating: 4.7, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop', experience: 6, languages: ['English'], bio: 'Experienced Neurologist at AIIMS', isActive: true },
      { firstName: 'Priya', lastName: 'Nair', fullName: 'Dr. Priya Nair', specialty: 'Oncologist', consultationFee: 700, rating: 4.8, image: 'https://images.unsplash.com/photo-1559839734-f1e726c273c5?q=80&w=800&auto=format&fit=crop', experience: 8, languages: ['English'], bio: 'Experienced Oncologist at Max Hospital', isActive: true },
      { firstName: 'Rajesh', lastName: 'Kumar', fullName: 'Dr. Rajesh Kumar', specialty: 'Gastroenterologist', consultationFee: 450, rating: 4.5, image: 'https://images.unsplash.com/photo-1582752930405-b0692d910dc0?q=80&w=800&auto=format&fit=crop', experience: 4, languages: ['English'], bio: 'Experienced Gastroenterologist at Manipal Hospitals', isActive: true }
    ];

    // Simple country data
    const countries = [
      { name: 'India', code: 'IN', currency: 'INR', timezone: 'Asia/Kolkata', isActive: true },
      { name: 'United States', code: 'US', currency: 'USD', timezone: 'America/New_York', isActive: true },
      { name: 'United Kingdom', code: 'GB', currency: 'GBP', timezone: 'Europe/London', isActive: true }
    ];

    // Simple language data
    const languages = [
      { fullName: 'English', shortCode: 'EN', isDefault: true, isActive: true },
      { fullName: 'Hindi', shortCode: 'HI', isActive: true },
      { fullName: 'Spanish', shortCode: 'ES', isActive: true }
    ];

    // Insert data
    await Hospital.insertMany(hospitals);
    console.log('✅ Hospitals seeded:', hospitals.length);

    await Doctor.insertMany(doctors);
    console.log('✅ Doctors seeded:', doctors.length);

    await Country.insertMany(countries);
    console.log('✅ Countries seeded:', countries.length);

    await Language.insertMany(languages);
    console.log('✅ Languages seeded:', languages.length);

    // Verify collections created
    const finalCollections = await db.listCollections().toArray();
    console.log('Final collections:', finalCollections.map(c => c.name));

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

quickSeed();
