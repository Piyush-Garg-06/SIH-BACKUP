import Appointment from '../models/Appointment.js';
import Worker from '../models/Worker.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js'; // Import User model
import dataService from '../services/dataService.js';
import notificationService from '../services/notificationService.js';

// @route   GET /api/appointments
// @desc    Get all appointments for the logged-in user
// @access  Private
export const getAppointments = async (req, res) => {
  try {
    const user = req.user;
    let appointments = [];

    if (user.role === 'worker' || user.role === 'patient') {
        const profile = await (user.role === 'worker' ? Worker.findOne({ user: user.id }) : Patient.findOne({ user: user.id }));
        if (profile) {
            appointments = await dataService.getAllAppointmentsForUser(profile._id, user.role);
        }
    } else if (user.role === 'doctor') {
        const doctorProfile = await Doctor.findOne({ user: user.id });
        if (doctorProfile) {
            // This logic is specific to doctors and should remain here
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            appointments = await Appointment.find({ doctor: doctorProfile._id, date: { $gte: currentDate } }).populate('worker', 'firstName lastName').sort('date time');
        }
    }

    res.json({ data: appointments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/appointments/user/:userId
// @desc    Get all appointments for a specific user
// @access  Private
export const getAppointmentsForUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const profile = await (user.role === 'worker' ? Worker.findOne({ user: userId }) : Patient.findOne({ user: userId }));
      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found for this user' });
      }

      const appointments = await dataService.getAppointmentsForUser(profile._id, user.role);
      res.json({ data: appointments });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// @route   GET /api/appointments/:id
// @desc    Get a specific appointment by ID
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('worker', 'firstName lastName')
      .populate('doctor', 'firstName lastName specialization')
      .populate('patient', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Check if user is authorized to view this appointment
    const user = req.user;
    const workerProfile = await Worker.findOne({ user: user.id });
    const doctorProfile = await Doctor.findOne({ user: user.id });
    const patientProfile = await Patient.findOne({ user: user.id });

    // For doctors, check if they are the assigned doctor
    const isAuthorizedDoctor = doctorProfile && appointment.doctor && 
      appointment.doctor._id.toString() === doctorProfile._id.toString();
    
    // For workers, check if they are the requesting worker
    const isAuthorizedWorker = workerProfile && appointment.worker && 
      appointment.worker._id.toString() === workerProfile._id.toString();
    
    // For patients, check if they are the requesting patient
    const isAuthorizedPatient = patientProfile && appointment.patient && 
      appointment.patient._id.toString() === patientProfile._id.toString();

    // Allow access if user is authorized
    if (!isAuthorizedDoctor && !isAuthorizedWorker && !isAuthorizedPatient) {
      console.log('User not authorized to view appointment:', {
        userId: user.id,
        userRole: user.role,
        doctorProfileId: doctorProfile ? doctorProfile._id : null,
        workerProfileId: workerProfile ? workerProfile._id : null,
        patientProfileId: patientProfile ? patientProfile._id : null,
        appointmentDoctorId: appointment.doctor ? appointment.doctor._id : null,
        appointmentWorkerId: appointment.worker ? appointment.worker._id : null,
        appointmentPatientId: appointment.patient ? appointment.patient._id : null
      });
      return res.status(401).json({ msg: 'User not authorized to view this appointment' });
    }

    console.log('Appointment data being sent:', appointment);
    res.json({ data: appointment });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Worker only)
export const createAppointment = async (req, res) => {
  const { doctorId, date, time, type, hospital, department, notes, contact, address, priority } = req.body;

  try {
    const user = req.user;

    if (user.role !== 'worker' && user.role !== 'patient') {
      return res.status(403).json({ msg: 'Only workers and patients can create appointments' });
    }

    let profileId;
    let workerProfile = null;
    if (user.role === 'worker') {
      workerProfile = await Worker.findOne({ user: user.id });
      if (!workerProfile) {
        return res.status(404).json({ msg: 'Worker profile not found' });
      }
      profileId = workerProfile._id;
    } else if (user.role === 'patient') {
      const patientProfile = await Patient.findOne({ user: user.id });
      if (!patientProfile) {
        return res.status(404).json({ msg: 'Patient profile not found' });
      }
      profileId = patientProfile._id;
    }

    const doctorProfile = await Doctor.findById(doctorId);
    if (!doctorProfile) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Get the doctor's user profile
    const doctorUser = await User.findById(doctorProfile.user);
    
    const newAppointment = new Appointment({
      worker: user.role === 'worker' ? profileId : null, // Link to worker if role is worker
      patient: user.role === 'patient' ? profileId : null, // Link to patient if role is patient
      doctor: doctorId,
      date,
      time,
      type,
      hospital,
      department,
      notes,
      contact,
      address,
      priority,
    });

    console.log('Creating appointment with data:', newAppointment);
    
    const appointment = await newAppointment.save();
    
    console.log('Appointment saved with status:', appointment.status);
    
    // Send notification to doctor if this is a worker appointment
    if (user.role === 'worker' && workerProfile && doctorUser) {
      const appointmentDetails = {
        date: new Date(date).toLocaleDateString(),
        time,
        type,
        hospital
      };
      
      await notificationService.sendAppointmentRequestNotification(
        doctorUser,
        workerProfile,
        appointmentDetails,
        appointment._id
      );
    }
    
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/appointments/:id
// @desc    Update an appointment
// @access  Private (Worker or Doctor who owns the appointment)
export const updateAppointment = async (req, res) => {
  const { date, time, type, hospital, department, status, priority, notes, contact, address } = req.body;

  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    const user = req.user;
    const workerProfile = await Worker.findOne({ user: user.id });
    const doctorProfile = await Doctor.findOne({ user: user.id });

    // Check if user is the worker who created the appointment or the doctor assigned to it
    const isAuthorizedWorker = workerProfile && appointment.worker.toString() === workerProfile._id.toString();
    const isAuthorizedDoctor = doctorProfile && appointment.doctor.toString() === doctorProfile._id.toString();

    if (!isAuthorizedWorker && !isAuthorizedDoctor) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update fields
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (type) appointment.type = type;
    if (hospital) appointment.hospital = hospital;
    if (department) appointment.department = department;
    if (status) appointment.status = status;
    if (priority) appointment.priority = priority;
    if (notes) appointment.notes = notes;
    if (contact) appointment.contact = contact;
    if (address) appointment.address = address;

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/appointments/:id/accept
// @desc    Accept an appointment by doctor
// @access  Private (Doctor only)
export const acceptAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id)
      .populate('worker', 'firstName lastName user')
      .populate('doctor', 'firstName lastName user');

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    const user = req.user;
    const doctorProfile = await Doctor.findOne({ user: user.id });

    // Check if user is the doctor assigned to the appointment
    const isAuthorizedDoctor = doctorProfile && appointment.doctor && 
      appointment.doctor._id.toString() === doctorProfile._id.toString();

    if (!isAuthorizedDoctor) {
      return res.status(401).json({ msg: 'User not authorized to accept this appointment' });
    }

    // Update appointment status to 'scheduled'
    appointment.status = 'scheduled';
    await appointment.save();

    // Send notification to worker
    if (appointment.worker) {
      const workerUser = await User.findById(appointment.worker.user);
      if (workerUser) {
        try {
          await notificationService.sendAppointmentAcceptedNotification(
            workerUser,
            appointment.worker,
            {
              doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
              date: new Date(appointment.date).toLocaleDateString(),
              time: appointment.time,
              hospital: appointment.hospital
            },
            appointment._id
          );
        } catch (notificationError) {
          console.error('Failed to send notification to worker:', notificationError);
        }
      }
    }

    res.json({ 
      msg: 'Appointment accepted successfully', 
      appointment 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/appointments/:id/reject
// @desc    Reject an appointment by doctor
// @access  Private (Doctor only)
export const rejectAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id)
      .populate('worker', 'firstName lastName user')
      .populate('doctor', 'firstName lastName user');

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    const user = req.user;
    const doctorProfile = await Doctor.findOne({ user: user.id });

    // Check if user is the doctor assigned to the appointment
    const isAuthorizedDoctor = doctorProfile && appointment.doctor && 
      appointment.doctor._id.toString() === doctorProfile._id.toString();

    if (!isAuthorizedDoctor) {
      return res.status(401).json({ msg: 'User not authorized to reject this appointment' });
    }

    // Update appointment status to 'cancelled'
    appointment.status = 'cancelled';
    await appointment.save();

    // Send notification to worker
    if (appointment.worker) {
      const workerUser = await User.findById(appointment.worker.user);
      if (workerUser) {
        try {
          await notificationService.sendAppointmentRejectedNotification(
            workerUser,
            appointment.worker,
            {
              doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
              date: new Date(appointment.date).toLocaleDateString(),
              time: appointment.time,
              hospital: appointment.hospital
            },
            appointment._id
          );
        } catch (notificationError) {
          console.error('Failed to send notification to worker:', notificationError);
        }
      }
    }

    res.json({ 
      msg: 'Appointment rejected successfully', 
      appointment 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment
// @access  Private (Worker or Doctor who owns the appointment)
export const deleteAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    const user = req.user;
    const workerProfile = await Worker.findOne({ user: user.id });
    const doctorProfile = await Doctor.findOne({ user: user.id });

    // Check if user is the worker who created the appointment or the doctor assigned to it
    const isAuthorizedWorker = workerProfile && appointment.worker.toString() === workerProfile._id.toString();
    const isAuthorizedDoctor = doctorProfile && appointment.doctor.toString() === doctorProfile._id.toString();

    if (!isAuthorizedWorker && !isAuthorizedDoctor) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await appointment.deleteOne();
    res.json({ msg: 'Appointment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};