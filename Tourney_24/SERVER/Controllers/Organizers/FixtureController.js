import mongoose from 'mongoose';
import Tournament from '../../Models/Organizer/Tournament.js';
import Team from '../../Models/Team/TeamModel.js';

// GET /api/organizer/fixtures/:tournamentId/teams
// Returns the list of teams attached to a tournament
const getTeams = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    // Validate Mongo ObjectId to avoid cast errors
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.json({ success: false, message: 'Invalid tournament id' });
    }

    const tournament = await Tournament.findById(tournamentId).populate('teams');
    if (!tournament) {
      return res.json({ success: false, message: 'Tournament not found' });
    }

    return res.json({ success: true, teams: tournament.teams });
  } catch (error) {
    console.log('Error in getTeams:', error);
    return res.json({ success: false, message: 'Error fetching teams' });
  }
};

// GET /api/organizer/fixtures/:tournamentId
// Returns all fixtures of a tournament populated with teams
const getFixtures = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.json({ success: false, message: 'Invalid tournament id' });
    }

    const fixtures = await (await import('../../Models/Fixture/FixtureModel.js')).default
      .find({ tournament: tournamentId })
      .populate('teamA teamB winner');

    return res.json({ success: true, fixtures });
  } catch (error) {
    console.log('Error in getFixtures:', error);
    return res.json({ success: false, message: 'Error fetching fixtures' });
  }
};

// PUT /api/organizer/fixtures/:fixtureId
// Update status / score / winner of a fixture
// Helper to map round name similar to frontend
const getRoundName = (roundNum, totalRounds) => {
  const roundsFromEnd = totalRounds - 1 - roundNum;
  if (roundsFromEnd === 0) return 'Final';
  if (roundsFromEnd === 1) return 'Semi-Final';
  if (roundsFromEnd === 2) return 'Quarter-Final';
  if (roundsFromEnd === 3) return 'Round of 16';
  return `Round ${roundNum + 1}`;
};

// POST /api/organizer/fixtures/:tournamentId/generate
// Generates the full bracket for a tournament (and optional event)
const generateFixtures = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { eventId } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.json({ success: false, message: 'Invalid tournament id' });
    }

    const tournament = await Tournament.findById(tournamentId).populate('teams');
    if (!tournament) {
      return res.json({ success: false, message: 'Tournament not found' });
    }

    let participants = tournament.teams.map((t) => t._id.toString());
    if (participants.length < 2) {
      return res.json({ success: false, message: 'Need at least 2 teams to generate fixtures' });
    }

    // Shuffle participants
    participants = participants.sort(() => 0.5 - Math.random());

    // Pad to next power of 2
    const nextPower = Math.pow(2, Math.ceil(Math.log2(participants.length)));
    while (participants.length < nextPower) participants.push(null);

    const Fixture = (await import('../../Models/Fixture/FixtureModel.js')).default;

    // Clear old fixtures for this tournament/event
    await Fixture.deleteMany({ tournament: tournamentId, ...(eventId ? { event: eventId } : {}) });

    const allDocs = [];
    const totalRounds = Math.log2(nextPower);
    let current = participants;
    let round = 0;

    while (current.length > 1) {
      for (let i = 0; i < current.length; i += 2) {
        allDocs.push({
          tournament: tournamentId,
          event: eventId,
          round,
          roundName: getRoundName(round, totalRounds),
          matchIndex: i / 2,
          teamA: current[i],
          teamB: current[i + 1],
          status: 'scheduled',
        });
      }
      current = new Array(current.length / 2).fill(null);
      round += 1;
    }

    const created = await Fixture.insertMany(allDocs);
    return res.json({ success: true, fixtures: created });
  } catch (error) {
    console.log('Error in generateFixtures:', error);
    return res.json({ success: false, message: 'Error generating fixtures' });
  }
};

const updateFixture = async (req, res) => {
  try {
    const { fixtureId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(fixtureId)) {
      return res.json({ success: false, message: 'Invalid fixture id' });
    }

    const Fixture = (await import('../../Models/Fixture/FixtureModel.js')).default;

    const updateData = {};
    const allowed = ['status', 'scoreA', 'scoreB', 'winner', 'scheduledAt', 'notes'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const updated = await Fixture.findByIdAndUpdate(fixtureId, updateData, { new: true })
      .populate('teamA teamB winner');

    if (!updated) return res.json({ success: false, message: 'Fixture not found' });

    // Propagate winner into next round fixture if provided
    if (updateData.winner) {
      try {
        const nextFixtureFilter = {
          tournament: updated.tournament,
          event: updated.event,
          round: updated.round + 1,
          matchIndex: Math.floor(updated.matchIndex / 2),
        };
        const Fixture = (await import('../../Models/Fixture/FixtureModel.js')).default;
        const nextFix = await Fixture.findOne(nextFixtureFilter);
        if (nextFix) {
          if (updated.matchIndex % 2 === 0) {
            nextFix.teamA = updateData.winner;
          } else {
            nextFix.teamB = updateData.winner;
          }
          await nextFix.save();
        }
      } catch (e) {
        console.log('Error propagating winner:', e);
      }
    }

    return res.json({ success: true, fixture: updated });
  } catch (error) {
    console.log('Error in updateFixture:', error);
    return res.json({ success: false, message: 'Error updating fixture' });
  }
};

export { getTeams, getFixtures, generateFixtures, updateFixture };
