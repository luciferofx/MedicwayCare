const mongoose = require('mongoose');
const { connectDB } = require('./config/db.cjs');

// Models
const Hospital = require('./models/Hospital.cjs');
const Doctor = require('./models/Doctor.cjs');
const Service = require('./models/Service.cjs');
const Treatments = require('./models/Treatments.cjs');
const FAQ = require('./models/FAQ.cjs');
const HospitalDetail = require('./models/HospitalDetail.cjs');
const Country = require('./models/Country.cjs');
const Blog = require('./models/Blog.cjs');
const Admin = require('./models/Admin.cjs');

// Data
const hospitalsData = require('./data/hospitals.js');
const doctorsData = require('./data/doctors.js');
const servicesData = require('./data/services.js');
const treatmentsData = require('./data/treatments.js');
const faqData = require('./data/faqdata.js');
const hospitalDetailsData = require('./data/hospitalDetails.js');
const countriesData = require('./data/countries.js');
const blogsData = require('./data/blogs.js');

const seedData = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting database seeding (Safe Mode)...');

        // Helper to seed only if empty
        const seedIfEmpty = async (Model, data, label) => {
            const count = await Model.countDocuments();
            if (count === 0) {
                await Model.create(data);
                console.log(`✅ Seeded ${data.length} ${label}`);
                return true;
            } else {
                console.log(`ℹ️  ${label} already has ${count} items, skipping seed.`);
                return false;
            }
        };

        // 1. Seed Countries
        await seedIfEmpty(Country, countriesData, 'countries');

        // 2. Seed Hospitals
        const hospitalCount = await Hospital.countDocuments();
        let createdHospitals = [];
        if (hospitalCount === 0) {
            createdHospitals = await Hospital.create(hospitalsData.map(h => ({
                name: h.name,
                country: h.location.split(', ')[1] || 'India',
                city: h.location.split(', ')[0] || 'Delhi',
                image: h.image,
                specialties: h.specialties,
                rating: h.rating,
                phone: 'N/A',
                blurb: `${h.name} is a leading healthcare provider in ${h.location}.`
            })));
            console.log(`✅ Seeded ${createdHospitals.length} hospitals`);
        } else {
            console.log(`ℹ️  Hospitals already has ${hospitalCount} items.`);
            createdHospitals = await Hospital.find({});
        }

        const hospitalMap = {};
        createdHospitals.forEach(h => {
            hospitalMap[h.name] = h._id;
        });

        // 3. Seed Doctors
        const doctorCount = await Doctor.countDocuments();
        if (doctorCount === 0) {
            const formattedDoctors = doctorsData.map(d => {
                const nameParts = d.name.replace('Dr. ', '').split(' ');
                return {
                    firstName: nameParts[0],
                    lastName: nameParts.slice(1).join(' ') || 'Unknown',
                    fullName: d.name,
                    image: d.image,
                    specialty: d.specialty,
                    rating: d.rating,
                    hospital: hospitalMap[d.hospital] || createdHospitals[0]?._id,
                    consultationFee: 500,
                    isActive: true
                };
            });
            await Doctor.create(formattedDoctors);
            console.log(`✅ Seeded ${formattedDoctors.length} doctors`);
        }

        // 4. Seed Services
        await seedIfEmpty(Service, servicesData.map(s => ({
            title: s.title,
            desc: s.desc,
            icon: s.icon,
            isActive: true
        })), 'services');

        // 5. Seed Treatments
        await seedIfEmpty(Treatments, treatmentsData.map(t => ({
            title: t.title,
            description: t.summary || t.description,
            image: t.image,
            category: 'General',
            typicalDuration: 60,
            isActive: true
        })), 'treatments');

        // 6. Seed FAQs
        await seedIfEmpty(FAQ, faqData, 'FAQs');

        // 7. Seed Blogs
        const admin = await Admin.findOne({ role: 'superadmin' });
        await seedIfEmpty(Blog, blogsData.map(b => ({ ...b, author: admin?._id })), 'blogs');

        // 8. Seed Hospital Details
        const hdCount = await HospitalDetail.countDocuments();
        if (hdCount === 0) {
            for (const hd of hospitalDetailsData) {
                let hospitalId = hospitalMap[hd.name];
                if (!hospitalId) continue;

                await HospitalDetail.create({
                    hospital: hospitalId,
                    description: hd.description,
                    address: hd.address,
                    coordinates: hd.coordinates,
                    facilities: hd.facilities,
                    operationRooms: hd.operationRooms,
                    outpatientFacilities: hd.outpatientFacilities,
                    established: hd.established,
                    email: hd.email,
                    website: hd.website,
                    languages: hd.languages,
                    transportation: hd.transportation
                });
            }
            console.log(`✅ Seeded ${hospitalDetailsData.length} hospital details`);
        }

        console.log('✨ Safe Seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
        process.exit(1);
    }
};

seedData();
