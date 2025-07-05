// populate_db.js - Script to populate MongoDB with sample organizations
import mongoose from 'mongoose';
import Organizer from './Models/Organizer/OrganizerModel.js';

// Connect to MongoDB
const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/Tourney');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Sample organizations with pre-hashed passwords
const sampleOrganizers = [
    {
        fullName: 'Sports Academy Mumbai',
        email: 'admin@sportsacademymumbai.com',
        mobileNumber: '+91-9876543210',
        password: '$2b$10$N966.uTN7okHn7YsQNutUu6Oey3g7hjUts4DuHiHYZ10HOV4ps5gS',  // organizer123
        isAccountVerified: true,
        verifyOtp: '',
        verifyOtpExpiredAt: 0,
        memberAccess: []
    },
    {
        fullName: 'Elite Sports Club Delhi',
        email: 'contact@elitesportsdelhi.com',
        mobileNumber: '+91-9876543211',
        password: '$2b$10$F.cW0YYsmjVkVfUdlPWxR.nNzntQaSVDpg2KvTGq/ViC5DNX6iKju',  // tournament456
        isAccountVerified: true,
        verifyOtp: '',
        verifyOtpExpiredAt: 0,
        memberAccess: []
    },
    {
        fullName: 'Champions Sports Foundation',
        email: 'info@championssports.org',
        mobileNumber: '+91-9876543212',
        password: '$2b$10$tPJ.gjPR2ZMtn4256zxRXe7MZiYc7J82fPMjRXcBtRVs17c2xfrgq',  // sports789
        isAccountVerified: true,
        verifyOtp: '',
        verifyOtpExpiredAt: 0,
        memberAccess: []
    },
    {
        fullName: 'Pro Athletes Bangalore',
        email: 'manager@proathletesbangalore.in',
        mobileNumber: '+91-9876543213',
        password: '$2b$10$tlwBad00yi41a5W5zoLpt.km7JQ2L/UKQeImUn.cNpNWuIdRVJtOG',  // admin999
        isAccountVerified: true,
        verifyOtp: '',
        verifyOtpExpiredAt: 0,
        memberAccess: []
    }
];

const populateDatabase = async () => {
    try {
        await connectMongoDB();
        
        // Clear existing organizers (optional)
        await Organizer.deleteMany({});
        console.log('Cleared existing organizers');
        
        // Insert sample organizers
        const result = await Organizer.insertMany(sampleOrganizers);
        console.log(`Successfully created ${result.length} organizations:`);
        
        result.forEach((org, index) => {
            console.log(`${index + 1}. ${org.fullName} - ${org.email}`);
        });
        
        console.log('\n=== Login Credentials ===');
        console.log('Email: admin@sportsacademymumbai.com | Password: organizer123');
        console.log('Email: contact@elitesportsdelhi.com | Password: tournament456');
        console.log('Email: info@championssports.org | Password: sports789');
        console.log('Email: manager@proathletesbangalore.in | Password: admin999');
        
        // Verify the data
        const count = await Organizer.countDocuments();
        console.log(`\nTotal organizers in database: ${count}`);
        
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDatabase connection closed');
    }
};

// Run the script
populateDatabase();
