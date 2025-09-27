import express from 'express';
import { getWorkerDashboard, getDoctorDashboard, getEmployerDashboard, getAdminDashboard, getPatientDashboard } from '../controllers/dashboard.js'; // Import getPatientDashboard
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/worker', auth, getWorkerDashboard);
router.get('/doctor', auth, getDoctorDashboard);
router.get('/employer', auth, getEmployerDashboard);
router.get('/admin', auth, getAdminDashboard);
router.get('/patient', auth, getPatientDashboard); // New route for patient dashboard

export default router;