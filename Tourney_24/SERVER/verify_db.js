// verify_db.js - Script to verify organizations in the database
import mongoose from 'mongoose';
import Organizer from './Models/Organizer/OrganizerModel.js';

const verifyDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Tourney');
        console.log('Connected to MongoDB');
        
        const organizers = await Organizer.find({}, {password: 0, verifyOtp: 0});
        console.log(`\nFound ${organizers.length} organizations in database:\n`);
        
        organizers.forEach((org, index) => {
            console.log(`${index + 1}. Organization: ${org.fullName}`);
            console.log(`   Email: ${org.email}`);
            console.log(`   Mobile: ${org.mobileNumber}`);
            console.log(`   Verified: ${org.isAccountVerified ? 'Yes' : 'No'}`);
            console.log(`   ID: ${org._id}`);
            console.log('   ---');
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed');
    }
};

verifyDatabase();
