const mongoose = require('mongoose');
require('dotenv').config();

const Hospital = require('./model/hospital.model.cjs');
const Doctor = require('./model/doctor.model.cjs');

const normalizeId = (id) => {
  if (!id) return null;
  if (id.$oid) return new mongoose.Types.ObjectId(id.$oid);
  if (typeof id === 'string') return new mongoose.Types.ObjectId(id);
  return id;
};

const syncData = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    
    // 1. Sync Hospitals
    const oldHospitals = await db.collection('hospital11').find({}).toArray();
    console.log(`🏥 Found ${oldHospitals.length} hospitals in hospital11`);
    
    if (oldHospitals.length > 0) {
      // Clear current hospitals
      await Hospital.deleteMany({});
      
      const transformedHospitals = oldHospitals.map(h => ({
        _id: normalizeId(h._id),
        name: h.name || h.hospitalName || h.hospital_name || 'Unknown Hospital',
        country: h.country || h.country1 || 'India',
        city: h.city || h.city1 || 'Unknown',
        specialties: Array.isArray(h.specialties) ? h.specialties : [h.specialty || 'General Medicine'],
        rating: parseFloat(h.rating || h.rating1 || 4.5),
        image: h.image || h.image1 || '',
        phone: h.phone || h.phone1 || '',
        blurb: h.blurb || h.blurb1 || h.description || '',
        beds: parseInt(h.beds || h.beds1 || 0),
        accreditation: Array.isArray(h.accreditation) ? h.accreditation : (h.accreditation ? [h.accreditation] : []),
        isActive: h.isActive !== undefined ? h.isActive : true
      }));
      
      await Hospital.insertMany(transformedHospitals);
      console.log(`✅ Migrated ${transformedHospitals.length} hospitals\n`);
    }
    
    // 2. Sync Doctors
    const oldDoctors = await db.collection('doctor11').find({}).toArray();
    console.log(`👨‍⚕️ Found ${oldDoctors.length} doctors in doctor11`);
    
    if (oldDoctors.length > 0) {
      // Clear current doctors
      await Doctor.deleteMany({});
      
      const transformedDoctors = oldDoctors.map(d => ({
        _id: normalizeId(d._id),
        firstName: d.firstName || d.firstName1 || 'Unknown',
        lastName: d.lastName || d.lastName1 || 'Doctor',
        fullName: d.fullName || `${d.firstName || d.firstName1 || ''} ${d.lastName || d.lastName1 || ''}`.trim() || 'Dr. Unknown',
        email: d.email || '',
        phone: d.phone || '',
        specialty: d.specialty || d.specialty1 || 'General Medicine',
        hospital: normalizeId(d.hospital || d.hospital1),
        consultationFee: parseFloat(d.consultationFee || d.consultationFee1 || 500),
        rating: parseFloat(d.rating || d.rating1 || 4.5),
        experience: parseInt(d.experience || d.experience1 || 5),
        languages: Array.isArray(d.languages || d.languages1) ? (d.languages || d.languages1) : ['English'],
        bio: d.bio || d.bio1 || '',
        image: d.image || d.image1 || '',
        isActive: d.isActive !== undefined ? d.isActive : true
      }));
      
      await Doctor.insertMany(transformedDoctors);
      console.log(`✅ Migrated ${transformedDoctors.length} doctors\n`);
    }
    
    console.log('🎉 Data synchronization completed!');
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Sync error:', error);
    process.exit(1);
  }
};

syncData();
