import express from 'express';
import auth from '../middleware/auth.js';
import { addPatient, addWorker } from '../controllers/emitra.js';

const router = express.Router();

// @route   POST api/emitra/patients
// @desc    Add a new patient to the database
// @access  Private (eMitra only)
router.post('/patients', auth, addPatient);

// @route   POST api/emitra/workers
// @desc    Add a new worker to the database
// @access  Private (eMitra only)
router.post('/workers', auth, addWorker);

export default router;