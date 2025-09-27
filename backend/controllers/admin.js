import Worker from '../models/Worker.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import HealthRecord from '../models/HealthRecord.js';
import healthCardService from '../services/healthCardService.js';
import bcrypt from 'bcryptjs';

// @desc    Add a new worker to the database
// @access  Private (Admin only)
export const addWorker = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
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
// @access  Private (Admin only)
export const addPatient = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('User is not admin');
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
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

    // Basic validation with detailed logging
    console.log('=== VALIDATION START ===');
    
    if (!firstName || firstName.trim() === '') {
      console.log('Validation failed: Missing firstName');
      return res.status(400).json({ msg: 'First name is required' });
    }
    if (!lastName || lastName.trim() === '') {
      console.log('Validation failed: Missing lastName');
      return res.status(400).json({ msg: 'Last name is required' });
    }
    if (!gender || gender.trim() === '') {
      console.log('Validation failed: Missing gender');
      return res.status(400).json({ msg: 'Gender is required' });
    }
    if (!dob || dob.trim() === '') {
      console.log('Validation failed: Missing dob');
      return res.status(400).json({ msg: 'Date of birth is required' });
    }
    if (!aadhaar || aadhaar.trim() === '') {
      console.log('Validation failed: Missing aadhaar');
      return res.status(400).json({ msg: 'Aadhaar number is required' });
    }
    if (!mobile || mobile.trim() === '') {
      console.log('Validation failed: Missing mobile');
      return res.status(400).json({ msg: 'Mobile number is required' });
    }
    if (!email || email.trim() === '') {
      console.log('Validation failed: Missing email');
      return res.status(400).json({ msg: 'Email is required' });
    }
    if (!nativeState || nativeState.trim() === '') {
      console.log('Validation failed: Missing nativeState');
      return res.status(400).json({ msg: 'Native state is required' });
    }
    if (!address || address.trim() === '') {
      console.log('Validation failed: Missing address');
      return res.status(400).json({ msg: 'Address is required' });
    }
    if (!district || district.trim() === '') {
      console.log('Validation failed: Missing district');
      return res.status(400).json({ msg: 'District is required' });
    }
    if (!pincode || pincode.trim() === '') {
      console.log('Validation failed: Missing pincode');
      return res.status(400).json({ msg: 'Pincode is required' });
    }
    if (!bloodGroup || bloodGroup.trim() === '') {
      console.log('Validation failed: Missing bloodGroup');
      return res.status(400).json({ msg: 'Blood group is required' });
    }
    if (!height || height === '') {
      console.log('Validation failed: Missing height');
      return res.status(400).json({ msg: 'Height is required' });
    }
    if (!weight || weight === '') {
      console.log('Validation failed: Missing weight');
      return res.status(400).json({ msg: 'Weight is required' });
    }

    // Validate height and weight are numbers
    console.log('=== NUMBER VALIDATION ===');
    const heightNum = Number(height);
    const weightNum = Number(weight);
    
    console.log('heightNum:', heightNum, 'isNaN:', isNaN(heightNum));
    console.log('weightNum:', weightNum, 'isNaN:', isNaN(weightNum));
    
    if (isNaN(heightNum) || heightNum <= 0) {
      console.log('Validation failed: Invalid height', height);
      return res.status(400).json({ msg: 'Height must be a valid positive number' });
    }
    if (isNaN(weightNum) || weightNum <= 0) {
      console.log('Validation failed: Invalid weight', weight);
      return res.status(400).json({ msg: 'Weight must be a valid positive number' });
    }

    // Validate date format and check if it's a future date
    console.log('=== DATE VALIDATION ===');
    console.log('dob value:', dob);
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dob)) {
      console.log('Validation failed: Invalid date format', dob);
      return res.status(400).json({ msg: 'Date of birth must be in YYYY-MM-DD format' });
    }

    // Check if date is in the future
    const birthDate = new Date(dob);
    console.log('birthDate object:', birthDate);
    console.log('birthDate valid:', !isNaN(birthDate.getTime()));
    
    if (isNaN(birthDate.getTime())) {
      console.log('Validation failed: Invalid date', dob);
      return res.status(400).json({ msg: 'Date of birth is not a valid date' });
    }
    
    const today = new Date();
    console.log('birthDate:', birthDate, 'today:', today);
    console.log('birthDate > today:', birthDate > today);
    
    if (birthDate > today) {
      console.log('Validation failed: Future date not allowed', dob);
      return res.status(400).json({ msg: 'Date of birth cannot be in the future' });
    }

    // Check if patient already exists
    console.log('=== DUPLICATE CHECK ===');
    console.log('Checking for existing user with email:', email);
    let user = await User.findOne({ email });
    if (user) {
      console.log('Validation failed: User already exists with email:', email);
      return res.status(400).json({ msg: 'Patient with this email already exists' });
    }

    // Check if aadhaar already exists
    console.log('Checking for existing patient with aadhaar:', aadhaar);
    let existingPatient = await Patient.findOne({ aadhaar });
    if (existingPatient) {
      console.log('Validation failed: Patient already exists with aadhaar:', aadhaar);
      return res.status(400).json({ msg: 'Patient with this Aadhaar number already exists' });
    }

    // Generate a default password
    console.log('=== PASSWORD GENERATION ===');
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    console.log('Password hashed successfully');

    // Create user account for patient
    console.log('=== USER CREATION ===');
    user = new User({
      email,
      password: hashedPassword,
      role: 'patient'
    });
    console.log('User object created');

    // Generate health ID
    console.log('=== HEALTH ID GENERATION ===');
    const healthId = healthCardService.generateHealthId();
    console.log('Health ID generated:', healthId);

    // Create patient profile
    console.log('=== PATIENT CREATION ===');
    const patient = new Patient({
      user: user._id,
      firstName,
      lastName,
      gender,
      dob: birthDate,
      aadhaar,
      mobile,
      email,
      nativeState,
      address,
      district,
      pincode,
      bloodGroup,
      height: heightNum,
      weight: weightNum,
      healthId
    });
    console.log('Patient object created');

    // Save user and patient
    console.log('=== SAVING TO DATABASE ===');
    console.log('Saving user...');
    await user.save();
    console.log('User saved with ID:', user._id);
    
    user.patient = patient._id;
    console.log('Updating user with patient reference...');
    await user.save();
    console.log('User updated with patient reference');

    console.log('Saving patient...');
    await patient.save();
    console.log('Patient saved with ID:', patient._id);

    console.log('=== SUCCESS RESPONSE ===');
    console.log('Patient added successfully:', patient._id);
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
    console.log('=== ERROR CAUGHT ===');
    console.error('Error in addPatient:', err.message);
    console.error('Full error:', err);
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      const errors = Object.values(err.errors).map(el => el.message);
      console.log('Mongoose validation error:', errors.join(', '));
      return res.status(400).json({ msg: errors.join(', ') });
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
      // Duplicate key error (e.g., email, aadhaar, mobile already exists)
      const field = Object.keys(err.keyValue)[0];
      console.log('Duplicate key error for field:', field);
      return res.status(400).json({ msg: `A patient with this ${field} already exists.` });
    }
    console.log('Unexpected error occurred');
    res.status(500).send('Server error');
  }
};

// @desc    Get all patients and workers for admin with filtering
// @access  Private (Admin only)
export const getAllPatients = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    // Get query parameters for filtering
    const { severity, disease } = req.query;

    // Base queries
    let workerQuery = {};
    let patientQuery = {};

    // Apply severity filter if provided
    if (severity && severity !== 'all') {
      // Get worker IDs with health records matching severity
      const workerRecords = await HealthRecord.find({ 
        worker: { $exists: true },
        severity: severity
      }).distinct('worker');

      // Get patient IDs with health records matching severity
      const patientRecords = await HealthRecord.find({ 
        patient: { $exists: true },
        severity: severity
      }).distinct('patient');

      workerQuery = { _id: { $in: workerRecords } };
      patientQuery = { _id: { $in: patientRecords } };
    }

    // Apply disease filter if provided
    if (disease && disease !== 'all') {
      // Get worker IDs with health records containing the disease in diagnosis
      const workerRecords = await HealthRecord.find({ 
        worker: { $exists: true },
        diagnosis: { $regex: disease, $options: 'i' }
      }).distinct('worker');

      // Get patient IDs with health records containing the disease in diagnosis
      const patientRecords = await HealthRecord.find({ 
        patient: { $exists: true },
        diagnosis: { $regex: disease, $options: 'i' }
      }).distinct('patient');

      // If we already have a worker query from severity filter, intersect the results
      if (workerQuery._id && workerQuery._id.$in) {
        workerQuery._id.$in = workerQuery._id.$in.filter(id => workerRecords.includes(id.toString()));
      } else {
        workerQuery = { _id: { $in: workerRecords } };
      }

      // If we already have a patient query from severity filter, intersect the results
      if (patientQuery._id && patientQuery._id.$in) {
        patientQuery._id.$in = patientQuery._id.$in.filter(id => patientRecords.includes(id.toString()));
      } else {
        patientQuery = { _id: { $in: patientRecords } };
      }
    }

    // Get workers and patients based on queries
    const workers = await Worker.find(workerQuery).select('_id firstName lastName email mobile bloodGroup employerName workLocation dob');
    const patients = await Patient.find(patientQuery).select('_id firstName lastName email mobile bloodGroup dob');
    
    // Helper function to calculate age from date of birth
    const calculateAge = (dob) => {
      if (!dob) return null;
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    };
    
    // Combine workers and patients into a single array with age calculation
    const allPatients = [
      ...workers.map(worker => ({
        ...worker.toObject(), 
        type: 'worker',
        age: calculateAge(worker.dob)
      })),
      ...patients.map(patient => ({
        ...patient.toObject(), 
        type: 'patient',
        age: calculateAge(patient.dob)
      }))
    ];

    res.json(allPatients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Send worker data to government
// @access  Private (Admin only)
export const sendWorkerDataToGovernment = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    // In a real implementation, this would:
    // 1. Fetch all worker data from the database
    // 2. Format the data according to government requirements
    // 3. Send the data to a government API or service
    // 4. Log the transmission for audit purposes

    // For now, we'll simulate this process
    const workers = await Worker.find().select('-user -__v');
    
    // Simulate sending data (in a real app, this would be an API call)
    console.log('Sending worker data to government:', workers.length, 'workers');
    
    // Log the transmission
    // In a real app, you might want to save this to a transmission log
    
    res.json({ 
      msg: `Successfully sent data for ${workers.length} workers to government`, 
      workersCount: workers.length 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Send selected data to government
// @access  Private (Admin only)
export const sendDataToGovernment = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    const { workers, doctors, healthRecords } = req.body;
    let message = 'Successfully sent data to government:';
    let totalCount = 0;

    // Send workers data if selected
    if (workers) {
      const workersData = await Worker.find().select('-user -__v');
      console.log('Sending workers data to government:', workersData.length, 'records');
      message += ` ${workersData.length} workers,`;
      totalCount += workersData.length;
    }

    // Send doctors data if selected
    if (doctors) {
      const doctorsData = await Doctor.find().select('-user -__v');
      console.log('Sending doctors data to government:', doctorsData.length, 'records');
      message += ` ${doctorsData.length} doctors,`;
      totalCount += doctorsData.length;
    }

    // Send health records data if selected
    if (healthRecords) {
      const healthRecordsData = await HealthRecord.find().select('-__v');
      console.log('Sending health records data to government:', healthRecordsData.length, 'records');
      message += ` ${healthRecordsData.length} health records,`;
      totalCount += healthRecordsData.length;
    }

    // Remove trailing comma and space
    message = message.replace(/,\s*$/, '');

    res.json({ 
      msg: message, 
      totalCount: totalCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};