require('dotenv').config();
const mongoose = require('mongoose');
const CategoryModel = require('./model/category.model.cjs');

const defaultCategories = [
    "CARDIOLOGY",
    "COSMETIC",
    "GYNECOLOGY",
    "HEMATOLOGY",
    "IVF and INFERTILITY",
    "NEUROSURGERY",
    "ONCOLOGY",
    "ORTHOPEDICS",
    "SPINE SURGERY"
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log("Connected to MongoDB");

        for (const catName of defaultCategories) {
            const slug = catName.toLowerCase().replace(/ and /g, '-').replace(/[^a-z0-9]+/g, '-');
            const exists = await CategoryModel.findOne({ 
                $or: [{ category_name: catName }, { slug }] 
            });

            if (!exists) {
                await CategoryModel.create({
                    category_name: catName,
                    slug: slug,
                    description: `Default category for ${catName}`,
                    is_active: true
                });
                console.log(`Added category: ${catName}`);
            } else {
                console.log(`Category already exists: ${catName}`);
            }
        }
        
        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding categories:", err);
        process.exit(1);
    }
};

seedCategories();
