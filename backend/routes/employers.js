import express from 'express';
import auth from '../middleware/auth.js';
import { getWorkersHealthStatus } from '../controllers/employers.js';

const router = express.Router();

// @route   GET api/employers/workers-health-status
// @desc    Get health status summary of workers associated with the logged-in employer
// @access  Private (Employer only)
router.get('/workers-health-status', auth, getWorkersHealthStatus);

export default router;
