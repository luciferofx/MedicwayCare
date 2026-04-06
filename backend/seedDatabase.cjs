const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Hospital = require('./models/Hospital.cjs');
const Doctor = require('./models/Doctor.cjs');
const Language = require('./models/Language.cjs');

// Import models from different folders
const CountryModel = require('./models/Country.cjs');
const CategoryModel = require('./model/category.model');

// Import data - handle ES6 exports
const hospitalsData = require('./data/hospitals.js');
const doctorsData = require('./data/doctors.js');

// Extract arrays from exports
const hospitals = hospitalsData.default || hospitalsData;
const doctors = doctorsData.default || doctorsData;

const ATLAS_URI = process.env.ATLAS_URI;

const seedDatabase = async () => {
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

    // Clear existing data - drop collections to avoid index conflicts
    try {
      await Hospital.collection.drop();
      await Doctor.collection.drop();
      await CountryModel.collection.drop();
      await CategoryModel.collection.drop();
      await Language.collection.drop();
      console.log('Dropped existing collections');
    } catch (error) {
      console.log('Some collections might not exist, continuing...');
    }

    // Seed Countries
    const countries = [
      { name: 'India', code: 'IN', currency: 'INR', timezone: 'Asia/Kolkata', isActive: true },
      { name: 'United States', code: 'US', currency: 'USD', timezone: 'America/New_York', isActive: true },
      { name: 'United Kingdom', code: 'GB', currency: 'GBP', timezone: 'Europe/London', isActive: true }
    ];
    
    await CountryModel.insertMany(countries);
    console.log('Countries seeded');

    // Seed Languages
    const languages = [
      { fullName: 'English', shortCode: 'EN', isDefault: true, isActive: true },
      { fullName: 'Hindi', shortCode: 'HI', isActive: true },
      { fullName: 'Spanish', shortCode: 'ES', isActive: true }
    ];
    await Language.insertMany(languages);
    console.log('Languages seeded');

    // Seed Categories
    const categories = [
      { category_name: 'Cardiology', slug: 'cardiology', is_active: true },
      { category_name: 'Orthopedics', slug: 'orthopedics', is_active: true },
      { category_name: 'Neurology', slug: 'neurology', is_active: true },
      { category_name: 'Oncology', slug: 'oncology', is_active: true },
      { category_name: 'General Medicine', slug: 'general-medicine', is_active: true }
    ];
    await CategoryModel.insertMany(categories);
    console.log('Categories seeded');

    // Seed Hospitals
    const hospitalDocs = hospitals.map(hospital => ({
      name: hospital.name,
      country: 'India',
      city: hospital.location.split(',')[0],
      specialties: hospital.specialties,
      rating: hospital.rating,
      image: hospital.image,
      language: 'EN',
      isActive: true
    }));
    await Hospital.insertMany(hospitalDocs);
    console.log('Hospitals seeded');

    // Seed Doctors
    const doctorDocs = doctors.map(doctor => ({
      firstName: doctor.name.split(' ')[1] || doctor.name,
      lastName: doctor.name.split(' ')[0] || '',
      fullName: doctor.name,
      specialty: doctor.specialty,
      hospital: null, // Will be populated after finding hospital
      consultationFee: 500,
      rating: doctor.rating,
      image: doctor.image,
      experience: 5,
      languages: ['English'],
      bio: `Experienced ${doctor.specialty} at ${doctor.hospital}`,
      isActive: true
    }));

    // Assign hospital to doctors (find by name)
    for (let doctor of doctorDocs) {
      const hospital = await Hospital.findOne({ name: doctor.hospital });
      if (hospital) {
        doctor.hospital = hospital._id;
      }
    }

    await Doctor.insertMany(doctorDocs);
    console.log('Doctors seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
