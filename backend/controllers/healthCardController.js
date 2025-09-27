import Worker from '../models/Worker.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import HealthRecord from '../models/HealthRecord.js';
import healthCardService from '../services/healthCardService.js';

export const getHealthCard = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Try to find as a Worker
    let profile = await Worker.findOne({ user: userId });
    let userType = 'worker';

    if (!profile) {
      // If not found as Worker, try to find as a Patient
      profile = await Patient.findOne({ user: userId });
      userType = 'patient';
    }

    if (!profile) {
      return res.status(404).json({ msg: 'Health card profile not found for this user.' });
    }

    // Fetch the associated User to get email and possibly other details
    const associatedUser = await User.findById(userId);
    if (!associatedUser) {
      return res.status(404).json({ msg: 'Associated user not found.' });
    }

    const healthCardData = {
      uniqueId: profile.healthId || 'Not Generated',
      name: `${profile.firstName} ${profile.lastName}`,
      abhaId: profile.aadhaar || 'N/A',
      dob: profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A',
      bloodGroup: profile.bloodGroup || 'N/A',
      emergencyContactName: profile.employerName || 'N/A', // Assuming employerName for worker, or add a dedicated field for patient
      emergencyContactNumber: profile.employerContact || 'N/A', // Assuming employerContact for worker, or add a dedicated field for patient
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 1 year validity from now
      issuedDate: new Date().toLocaleDateString(),
      status: 'Active',
      address: profile.address || 'N/A',
      district: profile.district || 'N/A',
      nativeState: profile.nativeState || 'N/A',
      email: associatedUser.email || 'N/A',
      contact: profile.mobile || 'N/A',
      // photo: profile.photo, // Assuming photo URL is available in profile
      userType: userType,
    };

    res.json({ data: healthCardData });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/health-cards/scan
// @desc    Get complete health information by scanning QR code
// @access  Public
export const getHealthInfoByQR = async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ msg: 'QR code data is required' });
    }

    let healthId;
    try {
      const parsedData = JSON.parse(qrData);
      healthId = parsedData.healthId || parsedData.id;
    } catch (parseError) {
      // If not JSON, assume direct health ID
      healthId = qrData;
    }

    if (!healthId) {
      return res.status(400).json({ msg: 'Invalid QR code format' });
    }

    // Get profile by health ID
    const result = await healthCardService.getProfileByHealthId(healthId);
    if (!result) {
      return res.status(404).json({ msg: 'Health card not found' });
    }

    const { profile, role } = result;

    // Fetch all health records for this person
    const healthRecords = await HealthRecord.find({
      [role === 'worker' ? 'worker' : 'patient']: profile._id
    })
    .populate('doctor', 'firstName lastName specialization')
    .sort({ date: -1 })
    .limit(10); // Get last 10 records

    // Calculate health summary
    const criticalRecords = healthRecords.filter(record => record.severity === 'critical').length;
    const lastCheckup = healthRecords.length > 0 ? healthRecords[0].date : null;
    const totalRecords = healthRecords.length;

    // Prepare comprehensive health information
    const healthInfo = {
      // Personal Information
      personalInfo: {
        healthId: profile.healthId,
        name: `${profile.firstName} ${profile.lastName}`,
        dateOfBirth: profile.dob,
        age: profile.dob ? Math.floor((Date.now() - new Date(profile.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        mobile: profile.mobile,
        email: profile.email,
        address: profile.address,
        district: profile.district,
        nativeState: profile.nativeState,
        type: role === 'worker' ? 'Migrant Worker' : 'Patient'
      },

      // Emergency Information
      emergencyInfo: {
        emergencyContact: profile.emergencyContact || profile.mobile,
        emergencyContactName: profile.emergencyContactName || 'Not specified',
        bloodGroup: profile.bloodGroup,
        allergies: profile.allergies || [],
        chronicConditions: profile.chronicConditions || [],
        medications: profile.medications || []
      },

      // Health Summary
      healthSummary: {
        totalRecords,
        criticalRecords,
        lastCheckup,
        overallStatus: criticalRecords > 0 ? 'Critical' : 
                      totalRecords === 0 ? 'No Records' : 'Stable'
      },

      // Recent Medical Records
      recentRecords: healthRecords.map(record => ({
        _id: record._id,
        date: record.date,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        severity: record.severity,
        symptoms: record.symptoms,
        doctor: record.doctor ? {
          name: `${record.doctor.firstName} ${record.doctor.lastName}`,
          specialization: record.doctor.specialization
        } : null,
        prescriptions: record.prescriptions || [],
        tests: record.tests || [],
        followUpDate: record.followUpDate
      })),

      // Additional Worker-specific info
      ...(role === 'worker' && {
        workInfo: {
          employerName: profile.employerName,
          workLocation: profile.workLocation,
          employmentType: profile.employmentType,
          workStartDate: profile.workStartDate
        }
      }),

      // Metadata
      scannedAt: new Date(),
      validCard: true
    };

    res.json({ success: true, data: healthInfo });

  } catch (err) {
    console.error('Error in getHealthInfoByQR:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

// @route   GET api/health-cards/verify/:healthId
// @desc    Verify health card and get complete health info for direct URL access
// @access  Public
export const verifyHealthCard = async (req, res) => {
  try {
    const { healthId } = req.params;
    
    if (!healthId) {
      return res.status(400).json({ msg: 'Health ID is required' });
    }

    // Get profile by health ID
    const result = await healthCardService.getProfileByHealthId(healthId);
    if (!result) {
      return res.status(404).json({ msg: 'Health card not found' });
    }

    const { profile, role } = result;

    // Fetch all health records for this person
    const healthRecords = await HealthRecord.find({
      [role === 'worker' ? 'worker' : 'patient']: profile._id
    })
    .populate('doctor', 'firstName lastName specialization')
    .sort({ date: -1 })
    .limit(10); // Get last 10 records

    // Calculate health summary
    const criticalRecords = healthRecords.filter(record => record.severity === 'critical').length;
    const lastCheckup = healthRecords.length > 0 ? healthRecords[0].date : null;
    const totalRecords = healthRecords.length;

    // Prepare comprehensive health information (same format as QR scanner)
    const healthInfo = {
      // Personal Information
      personalInfo: {
        healthId: profile.healthId,
        name: `${profile.firstName} ${profile.lastName}`,
        dateOfBirth: profile.dob,
        age: profile.dob ? Math.floor((Date.now() - new Date(profile.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        mobile: profile.mobile,
        email: profile.email,
        address: profile.address,
        district: profile.district,
        nativeState: profile.nativeState,
        type: role === 'worker' ? 'Migrant Worker' : 'Patient'
      },

      // Emergency Information
      emergencyInfo: {
        emergencyContact: profile.emergencyContact || profile.mobile,
        emergencyContactName: profile.emergencyContactName || 'Not specified',
        bloodGroup: profile.bloodGroup,
        allergies: profile.allergies || [],
        chronicConditions: profile.chronicConditions || [],
        medications: profile.medications || []
      },

      // Health Summary
      healthSummary: {
        totalRecords,
        criticalRecords,
        lastCheckup,
        overallStatus: criticalRecords > 0 ? 'Critical' : 
                      totalRecords === 0 ? 'No Records' : 'Stable'
      },

      // Recent Medical Records
      recentRecords: healthRecords.map(record => ({
        _id: record._id,
        date: record.date,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        severity: record.severity,
        symptoms: record.symptoms,
        doctor: record.doctor ? {
          name: `${record.doctor.firstName} ${record.doctor.lastName}`,
          specialization: record.doctor.specialization
        } : null,
        prescriptions: record.prescriptions || [],
        tests: record.tests || [],
        followUpDate: record.followUpDate
      })),

      // Additional Worker-specific info
      ...(role === 'worker' && {
        workInfo: {
          employerName: profile.employerName,
          workLocation: profile.workLocation,
          employmentType: profile.employmentType,
          workStartDate: profile.workStartDate
        }
      }),

      // Metadata
      scannedAt: new Date(),
      validCard: true
    };

    res.json({ success: true, data: healthInfo });

  } catch (err) {
    console.error('Error in verifyHealthCard:', err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};
