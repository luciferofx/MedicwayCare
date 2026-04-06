/**
 * Fallback values for Doctors and Hospitals
 * These reflect a premium, professional standard.
 */

export const DEFAULT_DOCTOR_DATA = {
    name: "Medical Professional",
    specialization: "Specialist Physician",
    experience: "15",
    rating: "4.9",
    reviews: "124",
    patients: "500+",
    fees: "500 - 1500",
    availability: "Mon - Sat (09:00 AM - 05:00 PM)",
    about: "This medical professional is dedicated to providing high-quality healthcare services with a focus on patient well-being and advanced clinical practices. With years of experience in the field, they offer expert diagnosis and personalized treatment plans.",
    educationAndTraining: [
        { degree: "Doctor of Medicine (M.D.)", institute: "Leading Medical University", year: "2010" },
        { degree: "Specialization Certification", institute: "National Board of Medical Specialties", year: "2015" }
    ],
    workExperience: "Over 15 years of dedicated service in various prestigious healthcare institutions, specializing in advanced diagnosis and patient care management.",
    location: {
        city: "Major City",
        country: "India",
        address: "Healthcare Excellence Center, Medical District",
        zipCode: "110001"
    }
};

export const DEFAULT_HOSPITAL_DATA = {
    name: "Premium Healthcare Center",
    hospitalType: "Multi-Specialty Hospital",
    rating: "4.8",
    reviews: "320",
    beds: "250+",
    established: "2005",
    doctorsCount: "45+",
    hospitalIntro: "Located in the heart of the city, this medical center is a premier healthcare institution renowned for its state-of-the-art infrastructure and compassionate patient care. We are committed to delivering world-class medical services across multiple specialties.",
    infrastructure: "Our facility spans over 100,000 square feet, featuring advanced diagnostic labs, modular operation theaters, and spacious patient suites designed for comfort and recovery.",
    facilities: "<li>24/7 Emergency & ICU</li><li>Advanced Imaging (MRI/CT)</li><li>International Patient Lounge</li><li>Pharmacy & Blood Bank</li><li>Valet Parking</li>",
    teamAndSpeciality: "Our team consists of internationally trained medical experts and highly skilled nursing staff dedicated to surgical excellence and comprehensive rehabilitation.",
    address: {
        line1: "Main Medical Avenue, Health Square",
        city: "Premium City",
        state: "State",
        pincode: "560001"
    }
};
