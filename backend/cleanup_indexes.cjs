require('dotenv').config();
const mongoose = require('mongoose');

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const collection = db.collection('countries');

        // List all indexes
        const indexes = await collection.indexes();
        console.log("Current indexes on countries collection:", indexes.map(i => i.name));

        // Attempt to drop multiple potentially conflicting unique indexes
        const indexesToDrop = ["slug_1", "name_1", "code_1"];

        for (const indexName of indexesToDrop) {
            try {
                await collection.dropIndex(indexName);
                console.log(`Successfully dropped '${indexName}' index.`);
            } catch (e) {
                console.log(`'${indexName}' index not found or already dropped.`);
            }
        }

        console.log("Cleanup complete. You can now run the seeding script safely.");
        process.exit(0);
    } catch (err) {
        console.error("Error during index cleanup:", err);
        process.exit(1);
    }
};

fixIndexes();
