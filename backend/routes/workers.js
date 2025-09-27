import express from 'express';
import { getWorkers, getWorkerProfile } from '../controllers/workers.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/workers
// @desc    Get all worker profiles
// @access  Private (Doctors can access this to select workers)
router.get('/', auth, getWorkers);

// @route   GET api/workers/profile
// @desc    Get worker profile for the logged-in user
// @access  Private (Worker only)
router.get('/profile', auth, getWorkerProfile);

export default router;
