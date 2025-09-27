import Hospital from '../models/Hospital.js';
import Doctor from '../models/Doctor.js';

// @route   GET /api/hospitals
// @desc    Get all hospitals
// @access  Public
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select('_id name location address district state');
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/hospitals/:id
// @desc    Get hospital by ID
// @access  Public
export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }
    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Hospital not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/hospitals/:id/doctors
// @desc    Get doctors in a specific hospital
// @access  Public
export const getDoctorsByHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }
    
    const doctors = await Doctor.find({ hospital: req.params.id })
      .select('_id firstName lastName specialization experience');
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Hospital not found' });
    }
    res.status(500).send('Server Error');
  }
};