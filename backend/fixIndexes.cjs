const mongoose = require('mongoose');
const { connectDB } = require('./config/db.cjs');

const fixIndexes = async () => {
    try {
        await connectDB();
        const collections = await mongoose.connection.db.collections();
        
        for (let collection of collections) {
            const indexes = await collection.indexes();
            console.log(`Checking indexes for collection: ${collection.collectionName}`);
            
            for (let index of indexes) {
                if (index.key.slug !== undefined) {
                    console.log(`🗑️  Found slug index on ${collection.collectionName}, dropping it...`);
                    try {
                        await collection.dropIndex(index.name);
                    } catch (e) {
                        console.error(`Failed to drop index ${index.name}:`, e.message);
                    }
                }
            }
        }
        
        console.log('✅ Finished cleaning up problematic indexes.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error fixing indexes:', err);
        process.exit(1);
    }
};

fixIndexes();
