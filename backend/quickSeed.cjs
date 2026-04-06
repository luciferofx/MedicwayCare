const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Hospital = require('./models/Hospital.cjs');
const Doctor = require('./models/Doctor.cjs');
const Country = require('./models/Country.cjs');
const Language = require('./models/Language.cjs');

const ATLAS_URI = process.env.ATLAS_URI;

const quickSeed = async () => {
  try {
    await mongoose.connect(ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    console.log('Connected to MongoDB');

    // Simple hospital data
    const hospitals = [
      { name: 'Apollo Hospitals', country: 'India', city: 'New Delhi', specialties: ['Cardiology', 'Oncology'], rating: 4.7, image: '', language: 'EN', isActive: true },
      { name: 'Fortis Hospital', country: 'India', city: 'Gurgaon', specialties: ['Orthopedics', 'Neurosciences'], rating: 4.6, image: '', language: 'EN', isActive: true },
      { name: 'AIIMS', country: 'India', city: 'New Delhi', specialties: ['General Medicine', 'Pediatrics'], rating: 4.9, image: '', language: 'EN', isActive: true }
    ];

    // Simple doctor data
    const doctors = [
      { firstName: 'Rahul', lastName: 'Sharma', fullName: 'Dr. Rahul Sharma', specialty: 'Cardiologist', consultationFee: 500, rating: 4.8, image: '', experience: 5, languages: ['English'], bio: 'Experienced Cardiologist', isActive: true },
      { firstName: 'Meera', lastName: 'Kapoor', fullName: 'Dr. Meera Kapoor', specialty: 'Orthopedic Surgeon', consultationFee: 600, rating: 4.6, image: '', experience: 7, languages: ['English'], bio: 'Experienced Orthopedic Surgeon', isActive: true },
      { firstName: 'Anil', lastName: 'Verma', fullName: 'Dr. Anil Verma', specialty: 'Neurologist', consultationFee: 550, rating: 4.7, image: '', experience: 6, languages: ['English'], bio: 'Experienced Neurologist', isActive: true }
    ];

    // Simple country data
    const countries = [
      { name: 'India', code: 'IN', currency: 'INR', timezone: 'Asia/Kolkata', isActive: true },
      { name: 'United States', code: 'US', currency: 'USD', timezone: 'America/New_York', isActive: true }
    ];

    // Simple language data
    const languages = [
      { fullName: 'English', shortCode: 'EN', isDefault: true, isActive: true },
      { fullName: 'Hindi', shortCode: 'HI', isActive: true }
    ];

    // Insert data
    await Hospital.insertMany(hospitals);
    console.log('Hospitals seeded');

    await Doctor.insertMany(doctors);
    console.log('Doctors seeded');

    await Country.insertMany(countries);
    console.log('Countries seeded');

    await Language.insertMany(languages);
    console.log('Languages seeded');

    console.log('Quick seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Quick seeding error:', error);
    process.exit(1);
  }
};

quickSeed();
