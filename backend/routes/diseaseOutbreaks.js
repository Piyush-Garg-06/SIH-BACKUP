import express from 'express';
import { 
  createOutbreak, 
  getOutbreaks, 
  getOutbreakById, 
  updateOutbreak, 
  deleteOutbreak,
  getOutbreaksByLocation,
  getOutbreaksByDisease,
  getRecentOutbreaks,
  getOutbreakStats
} from '../controllers/diseaseOutbreakController.js';
import { protect, admin, doctor, hospitalStaff } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getOutbreaks);

router.route('/recent')
  .get(getRecentOutbreaks);

router.route('/stats')
  .get(getOutbreakStats);

router.route('/location/:district/:state')
  .get(getOutbreaksByLocation);

router.route('/disease/:diseaseName')
  .get(getOutbreaksByDisease);

router.route('/:id')
  .get(getOutbreakById);

// Protected routes - doctors, hospital staff, and admins can create/update
router.route('/')
  .post(protect, doctor, hospitalStaff, admin, createOutbreak);

router.route('/:id')
  .put(protect, doctor, hospitalStaff, admin, updateOutbreak)
  .delete(protect, admin, deleteOutbreak);

export default router;