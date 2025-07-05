// seed_test_data.js
import mongoose from 'mongoose';
import 'dotenv/config';
import { connectMongoDB } from './Config/Connection.js';
import Tournament from './Models/Organizer/Tournament.js';
import Team from './Models/Team/TeamModel.js';

const organizerId = process.argv[2];         // passed on CLI
if (!organizerId) {
  console.error('Usage: node seed_test_data.js <organizerId>');
  process.exit(1);
}

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Tourney';

// ---------- sample data ----------
const TOURNAMENT_DATA = {
  name: 'Test Cup 2025',
  description: 'Seeded via seed_test_data.js',
  coverImage: 'https://via.placeholder.com/300x200.png',
  startDate: new Date('2025-08-01'),
  endDate:   new Date('2025-09-01'),
  location: 'National Stadium',
  sport: 'Football (5-a-side)',
  organization: organizerId,
  totalPlayers: 0
};

const TEAM_NAMES = [
  'Team Alpha',
  'Team Beta',
  'Team Gamma',
  'Team Delta',
  'Team Epsilon',
  'Team Zeta',
  'Team Theta',
  'Team Omega',
  'Team Phi',
  'Team Chi',
  'Team Psi',
  'Team Omega',
];
// ----------------------------------

(async () => {
  await connectMongoDB(uri);
  console.log('Connected to MongoDB');

  // 1) create tournament
  const tournament = await Tournament.create(TOURNAMENT_DATA);

  // 2) insert teams
  const teams = await Team.insertMany(
    TEAM_NAMES.map((name) => ({ name, tournament: tournament._id }))
  );

  // 3) attach team ids to tournament
  tournament.teams = teams.map((t) => t._id);
  await tournament.save();

  console.log('\n✅ Seed complete');
  console.log('Tournament id:', tournament._id);
  console.log('Team ids:', tournament.teams);

  await mongoose.disconnect();
})();