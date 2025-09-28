import express from 'express';
import auth from '../middleware/auth.js';
import { addWorker, sendWorkerDataToGovernment, addPatient, sendDataToGovernment, getAllPatients, assignPatientToDoctor, unassignPatientFromDoctor, getAllDoctors } from '../controllers/admin.js';

const router = express.Router();

// @route   POST api/admin/workers
// @desc    Add a new worker to the database
// @access  Private (Admin only)
router.post('/workers', auth, addWorker);

// @route   POST api/admin/patients
// @desc    Add a new patient to the database
// @access  Private (Admin only)
router.post('/patients', auth, addPatient);

// @route   GET api/admin/patients
// @desc    Get all patients and workers for admin with filtering
// @access  Private (Admin only)
router.get('/patients', auth, getAllPatients);

// @route   POST api/admin/send-to-government
// @desc    Send worker data to government
// @access  Private (Admin only)
router.post('/send-to-government', auth, sendWorkerDataToGovernment);

// @route   POST api/admin/send-data
// @desc    Send selected data to government
// @access  Private (Admin only)
router.post('/send-data', auth, sendDataToGovernment);

// @route   POST api/admin/assign-patient
// @desc    Assign a patient/worker to a doctor
// @access  Private (Admin only)
router.post('/assign-patient', auth, assignPatientToDoctor);

// @route   POST api/admin/unassign-patient
// @desc    Unassign a patient/worker from a doctor
// @access  Private (Admin only)
router.post('/unassign-patient', auth, unassignPatientFromDoctor);

// @route   GET api/admin/doctors
// @desc    Get all doctors
// @access  Private (Admin only)
router.get('/doctors', auth, getAllDoctors);

export default router;