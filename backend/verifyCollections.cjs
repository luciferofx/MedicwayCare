const mongoose = require('mongoose');
const { connectDB } = require('./config/db.cjs');

// Models
const models = {
    About: require('./models/About.cjs'),
    Admin: require('./models/Admin.cjs'),
    Appointment: require('./models/Appointment.cjs'),
    Assistance: require('./models/Assistance.cjs'),
    Blog: require('./models/Blog.cjs'),
    Bookings: require('./models/Bookings.cjs'),
    Contact: require('./models/Contact.cjs'),
    Content: require('./models/Content.cjs'),
    Country: require('./models/Country.cjs'),
    Doctor: require('./models/Doctor.cjs'),
    DoctorTreatment: require('./models/DoctorTreatment.cjs'),
    FAQ: require('./models/FAQ.cjs'),
    Headings: require('./models/Headings.cjs'),
    Hospital: require('./models/Hospital.cjs'),
    HospitalDetail: require('./models/HospitalDetail.cjs'),
    HospitalTreatment: require('./models/HospitalTreatment.cjs'),
    Service: require('./models/Service.cjs'),
    Treatments: require('./models/Treatments.cjs')
};

const verifyCollections = async () => {
    try {
        await connectDB();
        console.log('🔍 Verifying collections...');

        const results = {};
        for (const [name, Model] of Object.entries(models)) {
            try {
                const count = await Model.countDocuments();
                results[name] = { 
                    status: 'OK', 
                    count: count,
                    collection: Model.collection.name
                };
            } catch (err) {
                results[name] = { 
                    status: 'ERROR', 
                    error: err.message,
                    collection: Model.collection.name
                };
            }
        }

        console.table(results);
        
        const errors = Object.values(results).filter(r => r.status === 'ERROR');
        if (errors.length > 0) {
            console.error(`❌ Found ${errors.length} errors during verification.`);
            process.exit(1);
        } else {
            console.log('✅ All collections are operational!');
            process.exit(0);
        }
    } catch (err) {
        console.error('❌ Verification failed:', err);
        process.exit(1);
    }
};

verifyCollections();
