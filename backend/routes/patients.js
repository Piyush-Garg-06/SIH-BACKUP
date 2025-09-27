import express from 'express';
import { getPatients, getPatientProfile } from '../controllers/patients.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/patients
// @desc    Get all patient profiles
// @access  Private (Doctors can access this to select patients)
router.get('/', auth, getPatients);

// @route   GET api/patients/profile
// @desc    Get patient profile for the logged-in user
// @access  Private (Patient only)
router.get('/profile', auth, getPatientProfile);

export default router;
