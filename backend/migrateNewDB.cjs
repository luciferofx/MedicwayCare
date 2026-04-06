const mongoose = require('mongoose');
require('dotenv').config();

const Hospital = require('./models/Hospital.cjs');
const Doctor = require('./models/Doctor.cjs');

const migrateData = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to new MongoDB database\n');
    
    const db = mongoose.connection.db;
    
    // Check old collections
    const oldDoctorCount = await db.collection('doctor11').countDocuments();
    const oldHospitalCount = await db.collection('hospital11').countDocuments();
    
    console.log(`📊 Found in old collections:`);
    console.log(`   - doctor11: ${oldDoctorCount} documents`);
    console.log(`   - hospital11: ${oldHospitalCount} documents\n`);
    
    // Migrate doctors
    if (oldDoctorCount > 0) {
      console.log('👨‍⚕️ Migrating doctors from doctor11 to doctors...');
      const oldDoctors = await db.collection('doctor11').find({}).toArray();
      
      // Clear current doctors collection
      await Doctor.deleteMany({});
      
      // Transform and insert
      const transformedDoctors = oldDoctors.map(doc => ({
        firstName: doc.firstName || doc.firstName1 || 'Unknown',
        lastName: doc.lastName || doc.lastName1 || 'Doctor',
        fullName: doc.fullName || `${doc.firstName || ''} ${doc.lastName || ''}`.trim() || 'Dr. Unknown',
        specialty: doc.specialty || doc.specialty1 || 'General Medicine',
        hospital: doc.hospital || null,
        consultationFee: doc.consultationFee || doc.consultationFee1 || 500,
        rating: doc.rating || doc.rating1 || 4.5,
        image: doc.image || doc.image1 || '',
        experience: doc.experience || doc.experience1 || 5,
        languages: doc.languages || doc.languages1 || ['English'],
        bio: doc.bio || doc.bio1 || `Experienced ${doc.specialty || 'doctor'}`,
        isActive: doc.isActive !== undefined ? doc.isActive : true,
        email: doc.email || '',
        phone: doc.phone || ''
      }));
      
      await Doctor.insertMany(transformedDoctors);
      console.log(`✅ Migrated ${transformedDoctors.length} doctors\n`);
    }
    
    // Migrate hospitals
    if (oldHospitalCount > 0) {
      console.log('🏥 Migrating hospitals from hospital11 to hospitals...');
      const oldHospitals = await db.collection('hospital11').find({}).toArray();
      
      // Clear current hospitals collection
      await Hospital.deleteMany({});
      
      // Transform and insert
      const transformedHospitals = oldHospitals.map(hosp => ({
        name: hosp.name || hosp.hospitalName || hosp.hospital_name || 'Unknown Hospital',
        country: hosp.country || hosp.country1 || 'India',
        city: hosp.city || hosp.city1 || 'Unknown',
        specialties: hosp.specialties || hosp.specialties1 || hosp.specialty || ['General Medicine'],
        rating: hosp.rating || hosp.rating1 || 4.5,
        image: hosp.image || hosp.image1 || '',
        language: hosp.language || hosp.language1 || 'EN',
        phone: hosp.phone || hosp.phone1 || '+91-0000000000',
        blurb: hosp.blurb || hosp.blurb1 || hosp.description || 'A leading healthcare provider',
        isActive: hosp.isActive !== undefined ? hosp.isActive : true,
        beds: hosp.beds || hosp.beds1 || 100,
        accreditation: hosp.accreditation || hosp.accreditation1 || ['NABH']
      }));
      
      await Hospital.insertMany(transformedHospitals);
      console.log(`✅ Migrated ${transformedHospitals.length} hospitals\n`);
    }
    
    // Verify migration
    console.log('📊 Verification:');
    const newDoctorCount = await Doctor.countDocuments();
    const newHospitalCount = await Hospital.countDocuments();
    
    console.log(`   - doctors collection: ${newDoctorCount} documents`);
    console.log(`   - hospitals collection: ${newHospitalCount} documents\n`);
    
    if (newDoctorCount > 0 || newHospitalCount > 0) {
      console.log('🎉 Data migration completed successfully!');
      console.log('🔄 Restart your backend server and refresh the browser');
    } else {
      console.log('⚠️ No data was migrated');
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
};

migrateData();
