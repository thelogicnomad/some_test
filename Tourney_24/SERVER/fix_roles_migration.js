import mongoose from 'mongoose';
import Organizer from './Models/Organizer/OrganizerModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourney24';
        console.log('Connecting to MongoDB with URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const fixRoles = async () => {
    try {
        console.log('Starting role migration...');
        
        // First, check if there are any organizers at all
        const allOrganizers = await Organizer.find({});
        console.log(`Total organizers in database: ${allOrganizers.length}`);
        
        if (allOrganizers.length > 0) {
            console.log('Sample organizer data:');
            console.log(JSON.stringify(allOrganizers[0], null, 2));
        }
        
        // Find all users who have a clusterId that equals their own ID (original owners)
        const originalOwners = await Organizer.find({
            $expr: { $eq: ['$clusterId', '$_id'] }
        });
        
        console.log(`Found ${originalOwners.length} original owners`);
        
        for (const owner of originalOwners) {
            if (owner.role !== 'owner') {
                owner.role = 'owner';
                await owner.save();
                console.log(`Updated ${owner.email} to owner role`);
            }
        }
        
        // Find all users who have a clusterId but it's not their own ID (members)
        const members = await Organizer.find({
            clusterId: { $exists: true },
            $expr: { $ne: ['$clusterId', '$_id'] }
        });
        
        console.log(`Found ${members.length} members`);
        
        for (const member of members) {
            if (member.role !== 'member') {
                member.role = 'member';
                await member.save();
                console.log(`Updated ${member.email} to member role`);
            }
        }
        
        // Set currentOrganizationContext for users who don't have it
        const usersWithoutContext = await Organizer.find({
            currentOrganizationContext: { $exists: false }
        });
        
        console.log(`Found ${usersWithoutContext.length} users without organization context`);
        
        for (const user of usersWithoutContext) {
            user.currentOrganizationContext = user._id;
            await user.save();
            console.log(`Set organization context for ${user.email}`);
        }
        
        console.log('Role migration completed successfully!');
        
    } catch (error) {
        console.error('Error during role migration:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

const main = async () => {
    await connectDB();
    await fixRoles();
};

main();
