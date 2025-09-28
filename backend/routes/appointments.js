import express from 'express';
import { 
  getAppointments, 
  getAppointmentsForUser, 
  getAppointmentById, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
  acceptAppointment,
  rejectAppointment
} from '../controllers/appointments.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments for the logged-in user
// @access  Private
router.get('/', auth, getAppointments);

// @route   GET /api/appointments/user/:userId
// @desc    Get all appointments for a specific user
// @access  Private
router.get('/user/:userId', auth, getAppointmentsForUser);

// @route   GET /api/appointments/:id
// @desc    Get a specific appointment by ID
// @access  Private
router.get('/:id', auth, getAppointmentById);

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Worker only)
router.post('/', auth, createAppointment);

// @route   PUT /api/appointments/:id
// @desc    Update an appointment
// @access  Private (Worker or Doctor who owns the appointment)
router.put('/:id', auth, updateAppointment);

// @route   PUT /api/appointments/:id/accept
// @desc    Accept an appointment by doctor
// @access  Private (Doctor only)
router.put('/:id/accept', auth, acceptAppointment);

// @route   PUT /api/appointments/:id/reject
// @desc    Reject an appointment by doctor
// @access  Private (Doctor only)
router.put('/:id/reject', auth, rejectAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment
// @access  Private (Worker or Doctor who owns the appointment)
router.delete('/:id', auth, deleteAppointment);

export default router;