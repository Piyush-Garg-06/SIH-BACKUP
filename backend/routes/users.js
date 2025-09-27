import express from 'express';
import auth from '../middleware/auth.js';
import { updateProfile } from '../controllers/users.js';

const router = express.Router();

// @route   PUT api/users/profile
// @desc    Update user profile (worker, doctor, employer, patient)
// @access  Private
router.put('/profile', auth, updateProfile);

export default router;
