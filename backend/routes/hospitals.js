import express from 'express';
import { getHospitals, getHospitalById, getDoctorsByHospital } from '../controllers/hospitals.js';

const router = express.Router();

// Get all hospitals
router.get('/', getHospitals);

// Get hospital by ID
router.get('/:id', getHospitalById);

// Get doctors in a specific hospital
router.get('/:id/doctors', getDoctorsByHospital);

export default router;