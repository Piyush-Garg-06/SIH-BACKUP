import express from 'express';
import { getMyPatients, createHealthCheckup, getMedicalReports, createMedicalReport, updateSeverityAssessment, getDoctors, getDoctorProfile, updateDoctorProfile, addNewPatient } from '../controllers/doctors.js';
import auth from '../middleware/auth.js';
import Doctor from '../models/Doctor.js';
import Worker from '../models/Worker.js';
import Patient from '../models/Patient.js';

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

// New routes for assigning patients and workers to doctors
router.post('/assign-patient/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    
    // Check if patient is a worker or regular patient
    let patient = await Worker.findById(patientId);
    let isWorker = true;
    
    if (!patient) {
      patient = await Patient.findById(patientId);
      isWorker = false;
    }
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    // Add doctor to patient's doctors array if not already there
    if (!patient.doctors.includes(doctor._id)) {
      patient.doctors.push(doctor._id);
      await patient.save();
    }
    
    res.json({ msg: 'Patient assigned to doctor successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/unassign-patient/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    
    // Check if patient is a worker or regular patient
    let patient = await Worker.findById(patientId);
    let isWorker = true;
    
    if (!patient) {
      patient = await Patient.findById(patientId);
      isWorker = false;
    }
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    // Remove doctor from patient's doctors array
    patient.doctors = patient.doctors.filter(
      docId => docId.toString() !== doctor._id.toString()
    );
    await patient.save();
    
    res.json({ msg: 'Patient unassigned from doctor successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
