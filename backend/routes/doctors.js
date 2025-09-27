import express from 'express';
import { getMyPatients, createHealthCheckup, getMedicalReports, createMedicalReport, updateSeverityAssessment, getDoctors, getDoctorProfile, updateDoctorProfile, addNewPatient } from '../controllers/doctors.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getDoctors); // New route to get all doctors
router.get('/profile', auth, getDoctorProfile); // Get doctor profile
router.put('/profile', auth, updateDoctorProfile); // Update doctor profile
router.post('/add-patient', auth, addNewPatient); // Add new patient (worker or regular)
router.get('/patients', auth, getMyPatients);
router.post('/health-checkups', auth, createHealthCheckup);
router.get('/reports', auth, getMedicalReports);
router.post('/reports', auth, createMedicalReport);
router.post('/severity-assessment', auth, updateSeverityAssessment);

export default router;
