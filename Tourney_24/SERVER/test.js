import mongoose from 'mongoose';
import 'dotenv/config';
import { connectMongoDB } from './Config/Connection.js';
import Tournament from './Models/Organizer/Tournament.js';
import Team from './Models/Team/TeamModel.js';
import Fixture from './Models/Fixture/FixtureModel.js';

/*
  Stand-alone script to create quarter-final fixtures for an
  existing tournament.  Usage:

    node test.js <tournamentId>

  – Connects to MongoDB
  – Loads the tournament and its teams
  – Creates fixtures pairing teams sequentially (0 vs 1, 2 vs 3, …)
  – Saves fixture ids inside tournament.fixtures array
*/

const main = async () => {
  const tournamentId = process.argv[2];
  if (!tournamentId) {
    console.error('❌  Usage: node test.js <tournamentId>');
    process.exit(1);
  }

  await connectMongoDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/Tourney');
  console.log('✅ Connected to MongoDB');

  const tournament = await Tournament.findById(tournamentId).populate('teams');
  if (!tournament) {
    console.error('❌ Tournament not found');
    await mongoose.disconnect();
    process.exit(1);
  }

  // Use embedded teams array if populated, else fetch directly from Team collection
  const teamsDocs = tournament.teams && tournament.teams.length
    ? tournament.teams
    : await Team.find({ tournament: tournament._id });
  if (teamsDocs.length < 2) {
    console.error('❌ Not enough teams to create fixtures');
    await mongoose.disconnect();
    process.exit(1);
  }

  const roundName = 'Quarter-Final';
  const createdFixtures = [];

  for (let i = 0; i < teamsDocs.length; i += 2) {
    if (!teamsDocs[i + 1]) break; // odd team count guard
    const fx = await Fixture.create({
      tournament: tournament._id,
      round: 0,
      roundName,
      matchIndex: i / 2,
      teamA: teamsDocs[i]._id,
      teamB: teamsDocs[i + 1]._id,
      scheduledAt: new Date(),
    });
    createdFixtures.push(fx._id);
  }

  tournament.fixtures = createdFixtures;
  await tournament.save();

  console.log(`🆗 Fixtures seeded: ${createdFixtures.length}`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected');
};

main().catch((err) => {
  console.error('Unexpected error:', err);
  mongoose.disconnect();
});