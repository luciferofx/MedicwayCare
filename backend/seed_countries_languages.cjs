require('dotenv').config();
const mongoose = require('mongoose');
const CountryModel = require('./model/country.model.cjs');
const LanguageModel = require('./model/language.model.cjs');

const defaultLanguages = [
    { language_name: "English", fullName: "English", code: "en", shortCode: "EN" },
    { language_name: "Hindi", fullName: "Hindi", code: "hi", shortCode: "HI" },
    { language_name: "Turkish", fullName: "Turkish", code: "tr", shortCode: "TR" },
    { language_name: "Thai", fullName: "Thai", code: "th", shortCode: "TH" },
    { language_name: "Arabic", fullName: "Arabic", code: "ar", shortCode: "AR" },
    { language_name: "German", fullName: "German", code: "de", shortCode: "DE" }
];

const defaultCountries = [
    { country_name: "India", code: "IN", languages: ["English", "Hindi"] },
    { country_name: "Turkey", code: "TR", languages: ["Turkish"] },
    { country_name: "Thailand", code: "TH", languages: ["Thai"] },
    { country_name: "UAE", code: "AE", languages: ["Arabic"] },
    { country_name: "Germany", code: "DE", languages: ["German"] }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log("Connected to MongoDB");

        const languageMap = {};

        // Seed Languages
        for (const lang of defaultLanguages) {
            let existingLang = await LanguageModel.findOne({ 
                $or: [
                    { language_name: lang.language_name },
                    { fullName: lang.fullName }
                ],
                is_deleted: { $ne: true } 
            });

            if (!existingLang) {
                existingLang = await LanguageModel.create({
                    ...lang,
                    is_active: true
                });
                console.log(`Added language: ${lang.language_name}`);
            } else {
                console.log(`Language already exists: ${lang.language_name}`);
            }
            languageMap[lang.language_name] = existingLang._id;
        }

        // Seed Countries
        for (const country of defaultCountries) {
            const countryLangIds = country.languages.map(name => languageMap[name]).filter(id => !!id);
            
            // Find all potential matches (could have duplicates from old schemas)
            let matchingCountries = await CountryModel.find({ 
                $or: [
                    { country_name: country.country_name },
                    { name: country.country_name }
                ],
                is_deleted: { $ne: true } 
            });

            let existingCountry = null;
            if (matchingCountries.length > 0) {
                // Keep the best one (one that has country_name)
                existingCountry = matchingCountries.find(c => !!c.country_name) || matchingCountries[0];
                
                // Remove others to avoid index conflicts
                const others = matchingCountries.filter(c => c._id.toString() !== existingCountry._id.toString());
                for (const other of others) {
                    await CountryModel.deleteOne({ _id: other._id });
                    console.log(`Deleted duplicate country record: ${other.country_name || other.name}`);
                }
            }

            if (!existingCountry) {
                await CountryModel.create({
                    country_name: country.country_name,
                    name: country.country_name,
                    code: country.code,
                    languages: countryLangIds,
                    is_active: true,
                    isActive: true
                });
                console.log(`Added country: ${country.country_name}`);
            } else {
                // Update fields if they exist
                existingCountry.languages = countryLangIds;
                if (!existingCountry.country_name) existingCountry.country_name = country.country_name;
                if (!existingCountry.name) existingCountry.name = country.country_name;
                if (!existingCountry.code) existingCountry.code = country.code;
                
                await existingCountry.save();
                console.log(`Country already exists, updated: ${country.country_name}`);
            }
        }
        
        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding data:", err);
        process.exit(1);
    }
};

seedData();
