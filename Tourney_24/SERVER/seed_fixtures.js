// seed_fixtures.js - script to seed sample tournament, teams and (optionally) fixtures
import mongoose from 'mongoose';
import 'dotenv/config';
import { connectMongoDB } from './Config/Connection.js';
import Tournament from './Models/Organizer/Tournament.js';
import Team from './Models/Team/TeamModel.js';

// Update MONGODB_URI in your .env or fallback to local
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Tourney';

// Hard-coded data that matches the default state in the React Fixtures page
const TEAM_NAMES = [
  'The Leons',
  'Team Alpha',
  'Team Beta',
  'Team Gamma',
  'Team Delta',
  'Team Epsilon',
  'Team Zeta',
  'Team Theta',
];

(async () => {
  try {
    // connect
    await connectMongoDB(DB_URI);
    console.log('Connected to MongoDB');

    // 🔄 Clear previous seed (optional)
    await Promise.all([
      Tournament.deleteMany({ name: 'Sample Tournament – Fixtures Demo' }),
      Team.deleteMany({})
    ]);

    // 1️⃣ Create tournament
    const tournament = await Tournament.create({
      name: 'Sample Tournament – Fixtures Demo',
      description: 'Demo tournament seeded via seed_fixtures.js',
      coverImage: 'https://res.cloudinary.com/demo/image/upload/v1710000000/tourney_cover.jpg',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-09-01'),
      location: 'Virtual Arena',
      sport: 'Football (5-a-side)',
      organization: new mongoose.Types.ObjectId('65d000000000000000000000'), // Replace with real organizer id if needed
      totalPlayers: 0,
    });

    // 2️⃣ Insert teams and link to tournament
    const teamsDocs = await Team.insertMany(
      TEAM_NAMES.map((name) => ({ name, tournament: tournament._id }))
    );

    // 3️⃣ Store team ids inside tournament.teams
    tournament.teams = teamsDocs.map((t) => t._id);
    await tournament.save();

    console.log(`Seeded tournament "${tournament.name}" (_id=${tournament._id}) with ${teamsDocs.length} teams.`);
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
