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

export { getTeams };
