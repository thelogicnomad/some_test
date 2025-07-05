import express from 'express';
import { getTeams } from '../../Controllers/Organizers/FixtureController.js';
import { organizerAuthMidlleware } from '../../Middlewares/jwtAuth.js';

const router = express.Router();

// Fetch teams for fixtures page
router.get('/:tournamentId/teams', organizerAuthMidlleware, getTeams);

export default router;
