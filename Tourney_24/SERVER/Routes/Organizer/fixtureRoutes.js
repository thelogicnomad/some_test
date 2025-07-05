import express from 'express';
import { getTeams, getFixtures, generateFixtures, updateFixture } from '../../Controllers/Organizers/FixtureController.js';
import { organizerAuthMidlleware } from '../../Middlewares/jwtAuth.js';

const router = express.Router();

// Fetch teams for fixtures page
router.get('/:tournamentId/teams', organizerAuthMidlleware, getTeams);

// Get all fixtures of a tournament
router.get('/:tournamentId', organizerAuthMidlleware, getFixtures);

// Generate fixtures for a tournament
router.post('/:tournamentId/generate', organizerAuthMidlleware, generateFixtures);

// Update a single fixture (score/winner/status)
router.put('/fixture/:fixtureId', organizerAuthMidlleware, updateFixture);

export default router;
