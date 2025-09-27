import express from 'express';
import { getAppointments, getAppointmentsForUser, createAppointment, updateAppointment, deleteAppointment, getAppointmentById } from '../controllers/appointments.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments for the logged-in user
// @access  Private
router.get('/', auth, getAppointments);

// @route   GET /api/appointments/:id
// @desc    Get a specific appointment by ID
// @access  Private
router.get('/:id', auth, getAppointmentById);

// @route   GET /api/appointments/user/:userId
// @desc    Get all appointments for a specific user
// @access  Private
router.get('/user/:userId', auth, getAppointmentsForUser);

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', auth, createAppointment);

// @route   PUT /api/appointments/:id
// @desc    Update an appointment
// @access  Private
router.put('/:id', auth, updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', auth, deleteAppointment);

export default router;