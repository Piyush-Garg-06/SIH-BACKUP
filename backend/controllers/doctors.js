import Doctor from '../models/Doctor.js';
import Worker from '../models/Worker.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import HealthRecord from '../models/HealthRecord.js';
import bcrypt from 'bcryptjs';

// @route   GET /api/doctors/profile
// @desc    Get doctor profile
// @access  Private
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'email').populate('hospital', 'name location');
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }
    res.json({ profile: doctor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/doctors/profile
// @desc    Update doctor profile
// @access  Private
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true }
    ).populate('user', 'email').populate('hospital', 'name location');
    
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }
    
    res.json({ profile: doctor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public (or Private, depending on requirements)
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('_id firstName lastName specialization hospital').populate('hospital', 'name');
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getMyPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }

    // Get query parameters for filtering
    const { severity, disease } = req.query;

    // Base queries - find patients and workers directly assigned to this doctor
    let workerQuery = { doctors: doctor._id };
    let patientQuery = { doctors: doctor._id };

    // Apply severity filter if provided
    if (severity && severity !== 'all') {
      // Map frontend severity options to backend values
      let severityValue = severity;
      if (severity === 'low') {
        severityValue = 'normal';
      }
      
      // Get worker IDs with health records matching severity
      const workerRecords = await HealthRecord.find({ 
        worker: { $exists: true },
        severity: severityValue
      }).distinct('worker');

      // Get patient IDs with health records matching severity
      const patientRecords = await HealthRecord.find({ 
        patient: { $exists: true },
        severity: severityValue
      }).distinct('patient');

      // Intersect with doctor's patients/workers
      workerQuery._id = { $in: workerRecords };
      // workerQuery.doctors is already set to doctor._id above
      
      patientQuery._id = { $in: patientRecords };
      // patientQuery.doctors is already set to doctor._id above
    }

    // Apply disease filter if provided
    if (disease && disease !== 'all') {
      // Map frontend disease options to backend search terms
      let diseaseSearchTerm = disease;
      switch (disease) {
        case 'infectious':
          diseaseSearchTerm = 'infectious|tuberculosis|malaria|pneumonia';
          break;
        case 'non infectious':
          diseaseSearchTerm = 'non infectious|skin rash|allergies|fatigue|back pain';
          break;
        case 'communicable':
          diseaseSearchTerm = 'communicable|cardiac arrest';
          break;
        case 'non communicable':
          diseaseSearchTerm = 'non communicable|diabetes|hypertension|asthma';
          break;
        default:
          diseaseSearchTerm = disease;
      }
      
      // Get worker IDs with health records containing the disease in diagnosis
      const workerRecords = await HealthRecord.find({ 
        worker: { $exists: true },
        diagnosis: { $regex: diseaseSearchTerm, $options: 'i' }
      }).distinct('worker');

      // Get patient IDs with health records containing the disease in diagnosis
      const patientRecords = await HealthRecord.find({ 
        patient: { $exists: true },
        diagnosis: { $regex: diseaseSearchTerm, $options: 'i' }
      }).distinct('patient');

      // Intersect with doctor's patients/workers and any existing severity filter
      if (workerQuery._id && workerQuery._id.$in) {
        // Already filtered by severity, intersect with disease filter
        workerQuery._id.$in = workerQuery._id.$in.filter(id => workerRecords.includes(id.toString()));
      } else {
        // Only filtered by disease
        workerQuery._id = { $in: workerRecords };
        // Make sure doctor filter is still applied
        workerQuery.doctors = doctor._id;
      }
      
      if (patientQuery._id && patientQuery._id.$in) {
        // Already filtered by severity, intersect with disease filter
        patientQuery._id.$in = patientQuery._id.$in.filter(id => patientRecords.includes(id.toString()));
      } else {
        // Only filtered by disease
        patientQuery._id = { $in: patientRecords };
        // Make sure doctor filter is still applied
        patientQuery.doctors = doctor._id;
      }
    }

    // Get workers and patients based on queries
    const workers = await Worker.find(workerQuery).select('_id firstName lastName email mobile bloodGroup dob doctors');
    const patients = await Patient.find(patientQuery).select('_id firstName lastName email mobile bloodGroup dob doctors');
    
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

    // Add severity information to each patient
    for (const patient of allPatients) {
      const healthRecord = await HealthRecord.findOne({ 
        $or: [
          { worker: patient._id },
          { patient: patient._id }
        ]
      }).sort({ date: -1 });

      if (healthRecord) {
        // Map backend severity values to frontend values
        if (healthRecord.severity === 'normal') {
          patient.severity = 'low';
        } else if (healthRecord.severity === 'critical') {
          patient.severity = 'high';
        } else {
          patient.severity = healthRecord.severity;
        }
      } else {
        patient.severity = 'low';
      }
    }

    res.json(allPatients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const createHealthCheckup = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }

    const { workerId, date, findings, recommendations, ...healthData } = req.body;

    if (!workerId) {
      return res.status(400).json({ msg: 'Patient ID is required' });
    }

    if (!findings) {
      return res.status(400).json({ msg: 'Findings are required' });
    }

    // Check if the selected ID is a worker or patient
    let isWorker = false;
    let isPatient = false;
    
    const worker = await Worker.findById(workerId);
    const patient = await Patient.findById(workerId);
    
    if (worker) {
      isWorker = true;
    } else if (patient) {
      isPatient = true;
    } else {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const healthRecord = new HealthRecord({
      worker: isWorker ? workerId : null,
      patient: isPatient ? workerId : null,
      doctor: doctor._id,
      date: date ? new Date(date) : new Date(),
      diagnosis: findings, // Map findings to diagnosis
      treatment: recommendations || 'No specific treatment recommended', // Map recommendations to treatment
      symptoms: healthData.symptoms || '',
      followUpDate: healthData.followUpDate ? new Date(healthData.followUpDate) : null,
      severity: healthData.severity || 'normal',
      status: 'completed',
      prescriptions: healthData.prescriptions || [],
      tests: healthData.tests || [],
      hospitalName: healthData.hospitalName || ''
    });

    await healthRecord.save();

    res.json({
      success: true,
      message: 'Health checkup recorded successfully',
      healthRecord
    });
  } catch (err) {
    console.error('Error in createHealthCheckup:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

export const getMedicalReports = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }

    const reports = await HealthRecord.find({ doctor: doctor._id })
      .populate('worker', ['firstName', 'lastName', 'mobile', 'email'])
      .populate('patient', ['firstName', 'lastName', 'mobile', 'email'])
      .sort({ date: -1 }); // Sort by most recent first

    res.json(reports);
  } catch (err) {
    console.error('Error in getMedicalReports:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

export const createMedicalReport = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }

    const { workerId, date, findings, recommendations, ...reportData } = req.body;

    if (!workerId) {
      return res.status(400).json({ msg: 'Patient ID is required' });
    }

    if (!findings) {
      return res.status(400).json({ msg: 'Findings are required' });
    }

    // Check if the selected ID is a worker or patient
    let isWorker = false;
    let isPatient = false;
    
    const worker = await Worker.findById(workerId);
    const patient = await Patient.findById(workerId);
    
    if (worker) {
      isWorker = true;
    } else if (patient) {
      isPatient = true;
    } else {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const report = new HealthRecord({
      worker: isWorker ? workerId : null,
      patient: isPatient ? workerId : null,
      doctor: doctor._id,
      date: date ? new Date(date) : new Date(),
      diagnosis: findings, // Map findings to diagnosis
      treatment: recommendations || 'No specific treatment recommended', // Map recommendations to treatment
      symptoms: reportData.symptoms || '',
      followUpDate: reportData.followUpDate ? new Date(reportData.followUpDate) : null,
      severity: reportData.severity || 'normal',
      status: 'completed',
      prescriptions: reportData.prescriptions || [],
      tests: reportData.tests || [],
      hospitalName: reportData.hospitalName || ''
    });

    await report.save();

    res.json(report);
  } catch (err) {
    console.error('Error in createMedicalReport:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

export const updateSeverityAssessment = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }

    const { workerId, severityLevel } = req.body;

    // Find the latest health record for the worker
    const latestHealthRecord = await HealthRecord.findOne({ worker: workerId })
      .sort({ date: -1 });

    if (!latestHealthRecord) {
      return res.status(404).json({ msg: 'No health records found for this worker.' });
    }

    latestHealthRecord.severity = severityLevel;
    await latestHealthRecord.save();

    res.json(latestHealthRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const addNewPatient = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor profile not found' });
    }

    const {
      patientType, // 'worker' or 'patient'
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
      emergencyContact,
      emergencyContactName,
      medicalHistory,
      allergies,
      medications,
      vaccinations,
      // Worker-specific fields
      workLocation,
      employerName,
      jobType,
      workStartDate,
      password, // Temporary password
      role
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !gender || !dob || !mobile || !email || !aadhaar) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    const existingByAadhaar = await User.findOne({ aadhaar });
    if (existingByAadhaar) {
      return res.status(400).json({ msg: 'User with this Aadhaar already exists' });
    }

    let newPatient;
    let healthId;

    // Import health card service for generating health ID
    const { default: healthCardService } = await import('../services/healthCardService.js');
    healthId = healthCardService.generateHealthId();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'TempPass123!', salt);

    // Create user account
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: patientType,
      userType: patientType,
      mobile,
      aadhaar,
      isVerified: true, // Doctor-created accounts are pre-verified
      healthId
    });

    await newUser.save();

    if (patientType === 'worker') {
      // Validate worker-specific fields
      if (!workLocation || !employerName || !jobType) {
        return res.status(400).json({ msg: 'Please provide all required worker fields' });
      }

      newPatient = new Worker({
        user: newUser._id,
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
        emergencyContact,
        emergencyContactName,
        medicalHistory,
        allergies,
        medications,
        vaccinations: vaccinations ? vaccinations.split(',').map(v => v.trim()) : [],
        employmentType: jobType,
        employerName,
        workLocation,
        workAddress: workLocation,
        workStartDate: workStartDate ? new Date(workStartDate) : null,
        healthId
      });
    } else {
      // Regular patient
      newPatient = new Patient({
        user: newUser._id,
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
        emergencyContact,
        emergencyContactName,
        medicalHistory,
        allergies,
        medications,
        vaccinations: vaccinations ? vaccinations.split(',').map(v => v.trim()) : [],
        healthId
      });
    }

    await newPatient.save();

    res.json({
      success: true,
      message: `${patientType === 'worker' ? 'Migrant worker' : 'Patient'} added successfully`,
      patient: newPatient,
      healthId
    });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ msg: `A user with this ${field} already exists` });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};