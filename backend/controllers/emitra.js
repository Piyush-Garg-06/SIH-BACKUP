import Worker from '../models/Worker.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import healthCardService from '../services/healthCardService.js';
import bcrypt from 'bcryptjs';

// @desc    Add a new worker to the database
// @access  Private (eMitra only)
export const addWorker = async (req, res) => {
  try {
    // Check if user is emitra
    if (req.user.role !== 'emitra') {
      return res.status(403).json({ msg: 'Access denied. eMitra operators only.' });
    }

    const {
      firstName,
      lastName,
      gender,
      dob,
      aadhaar,
      mobile,
      email,
      nativeState,
      address,
      district,
      pincode,
      bloodGroup,
      height,
      weight,
      employmentType,
      employerName,
      workLocation,
      workAddress
    } = req.body;

    // Check if worker already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Worker with this email already exists' });
    }

    // Check if aadhaar already exists
    let existingWorker = await Worker.findOne({ aadhaar });
    if (existingWorker) {
      return res.status(400).json({ msg: 'Worker with this Aadhaar number already exists' });
    }

    // Generate a default password
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Create user account for worker
    user = new User({
      email,
      password: hashedPassword,
      role: 'worker'
    });

    // Generate health ID
    const healthId = healthCardService.generateHealthId();

    // Create worker profile
    const worker = new Worker({
      user: user._id,
      firstName,
      lastName,
      gender,
      dob: new Date(dob),
      aadhaar,
      mobile,
      email,
      nativeState,
      address,
      district,
      pincode,
      bloodGroup,
      height: Number(height),
      weight: Number(weight),
      employmentType,
      employerName,
      workLocation,
      workAddress,
      healthId
    });

    // Save user and worker
    await user.save();
    user.worker = worker._id;
    await user.save();

    await worker.save();

    res.json({ 
      msg: 'Worker added successfully', 
      worker: {
        id: worker._id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        healthId: worker.healthId
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Add a new patient to the database
// @access  Private (eMitra only)
export const addPatient = async (req, res) => {
  try {
    // Check if user is emitra
    if (req.user.role !== 'emitra') {
      console.log('User is not emitra');
      return res.status(403).json({ msg: 'Access denied. eMitra operators only.' });
    }

    // Log the incoming request body for debugging
    console.log('=== INCOMING PATIENT DATA ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    
    const {
      firstName,
      lastName,
      gender,
      dob,
      aadhaar,
      mobile,
      email,
      nativeState,
      address,
      district,
      pincode,
      bloodGroup,
      height,
      weight,
      emergencyContact,
      emergencyContactName,
      medicalHistory,
      allergies,
      medications
    } = req.body;

    // Log each field individually
    console.log('=== FIELD VALUES ===');
    console.log('firstName:', firstName, 'type:', typeof firstName);
    console.log('lastName:', lastName, 'type:', typeof lastName);
    console.log('gender:', gender, 'type:', typeof gender);
    console.log('dob:', dob, 'type:', typeof dob);
    console.log('aadhaar:', aadhaar, 'type:', typeof aadhaar);
    console.log('mobile:', mobile, 'type:', typeof mobile);
    console.log('email:', email, 'type:', typeof email);
    console.log('nativeState:', nativeState, 'type:', typeof nativeState);
    console.log('address:', address, 'type:', typeof address);
    console.log('district:', district, 'type:', typeof district);
    console.log('pincode:', pincode, 'type:', typeof pincode);
    console.log('bloodGroup:', bloodGroup, 'type:', typeof bloodGroup);
    console.log('height:', height, 'type:', typeof height);
    console.log('weight:', weight, 'type:', typeof weight);

    // Validate required fields
    if (!firstName || !lastName || !gender || !dob || !aadhaar || !mobile || !email || 
        !nativeState || !address || !district || !pincode || !bloodGroup || 
        height === undefined || weight === undefined) {
      console.log('Missing required fields');
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    // Check if patient already exists by email
    let user = await User.findOne({ email });
    if (user) {
      console.log('User with this email already exists');
      return res.status(400).json({ msg: 'Patient with this email already exists' });
    }

    // Check if aadhaar already exists
    let existingPatient = await Patient.findOne({ aadhaar });
    if (existingPatient) {
      console.log('Patient with this Aadhaar number already exists');
      return res.status(400).json({ msg: 'Patient with this Aadhaar number already exists' });
    }

    // Generate a default password
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Create user account for patient
    user = new User({
      email,
      password: hashedPassword,
      role: 'patient'
    });

    // Generate health ID
    const healthId = healthCardService.generateHealthId();

    // Create patient profile
    const patient = new Patient({
      user: user._id,
      firstName,
      lastName,
      gender,
      dob: new Date(dob),
      aadhaar,
      mobile,
      email,
      nativeState,
      address,
      district,
      pincode,
      bloodGroup,
      height: Number(height),
      weight: Number(weight),
      emergencyContact,
      emergencyContactName,
      medicalHistory,
      allergies,
      medications,
      healthId
    });

    // Save user and patient
    await user.save();
    user.patient = patient._id;
    await user.save();

    await patient.save();

    console.log('Patient created successfully:', patient);

    res.json({ 
      msg: 'Patient added successfully', 
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        healthId: patient.healthId
      }
    });
  } catch (err) {
    console.error('Error in addPatient:', err.message);
    res.status(500).send('Server error');
  }
};