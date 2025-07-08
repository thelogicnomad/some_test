import express from 'express';
import { signUp, verifyEmailWithOTP, login, createTournament, getAllTournaments, getParticularTournament, getProfile, getDashboardStats, addMember, getOrganizationMembers, getAccessibleOrganizations, getCurrentOrganization, switchOrganization, createOrganization } from '../../Controllers/Organizers/OrganizerController.js';
import { organizerAuthMidlleware } from '../../Middlewares/jwtAuth.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signUp);
router.post('/verify-otp', verifyEmailWithOTP);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', organizerAuthMidlleware, getProfile);
router.get('/dashboard-stats', organizerAuthMidlleware, getDashboardStats);
router.post('/tournament', organizerAuthMidlleware, createTournament);
router.get('/tournaments', organizerAuthMidlleware, getAllTournaments);
router.get('/tournament/:tournamentId', organizerAuthMidlleware, getParticularTournament);

// Member management routes
router.post('/add-member', organizerAuthMidlleware, addMember);
router.get('/members', organizerAuthMidlleware, getOrganizationMembers);
router.get('/accessible-organizations', organizerAuthMidlleware, getAccessibleOrganizations);
router.get('/current-organization', organizerAuthMidlleware, getCurrentOrganization);
router.post('/switch-organization', organizerAuthMidlleware, switchOrganization);
router.post('/create-organization', organizerAuthMidlleware, createOrganization);

export default router;
