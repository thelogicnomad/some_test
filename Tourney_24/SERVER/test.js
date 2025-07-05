import Fixture from './Models/Fixture/FixtureModel.js';

const roundName = 'Quarter-Final';
const createdFixtures = [];

for (let i = 0; i < teamsDocs.length; i += 2) {
  const fx = await Fixture.create({
    tournament: tournament._id,
    round: 0,
    roundName,
    matchIndex: i / 2,
    teamA: teamsDocs[i]._id,
    teamB: teamsDocs[i + 1]._id,
    scheduledAt: new Date('2025-08-05T16:00:00Z'),
  });
  createdFixtures.push(fx._id);
}
tournament.fixtures = createdFixtures;
await tournament.save();
console.log('🆗 Fixtures seeded:', createdFixtures.length);