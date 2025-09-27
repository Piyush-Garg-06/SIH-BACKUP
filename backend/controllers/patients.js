import Patient from '../models/Patient.js';

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('-user'); // Exclude the user field
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get patient profile for the logged-in user
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ msg: 'Patient profile not found' });
    }
    res.json({ profile: patient });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
