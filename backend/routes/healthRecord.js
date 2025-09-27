import express from 'express';
import { createHealthRecord, getHealthRecordById, updateHealthRecord, deleteHealthRecord, downloadHealthRecords, getPatientRecords, getHealthRecords, getMyHealthRecords } from '../controllers/healthRecord.js';
import auth from '../middleware/auth.js';

const router = express.Router(); // Corrected line

// @route   POST api/health-records
// @desc    Create a health record
// @access  Private (Doctor)
router.post('/', auth, createHealthRecord);

// @route   GET api/health-records/worker/:workerId
// @desc    Get all health records for a worker
// @access  Private
router.get('/worker/:workerId', auth, getHealthRecords);

// @route   GET api/health-records/patient/:patientId
// @desc    Get all health records for a patient
// @access  Private
router.get('/patient/:patientId', auth, getPatientRecords); // New route

// @route   GET api/health-records/my-records
// @desc    Get all health records for the logged-in user
// @access  Private (Worker or Patient)
router.get('/my-records', auth, getMyHealthRecords);

// @route   GET api/health-records/:id
// @desc    Get a single health record by ID
// @access  Private
router.get('/:id', auth, getHealthRecordById);

// @route   PUT api/health-records/:id
// @desc    Update a health record
// @access  Private (Doctor who created it)
router.put('/:id', auth, updateHealthRecord);

// @route   DELETE api/health-records/:id
// @desc    Delete a health record
// @access  Private (Doctor who created it)
router.delete('/:id', auth, deleteHealthRecord);

// @route   GET api/health-records/download/worker/:workerId
// @desc    Download all health records for a worker as PDF
// @access  Private
router.get('/download/worker/:workerId', auth, downloadHealthRecords);

export default router;