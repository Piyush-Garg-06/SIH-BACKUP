import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Doctor from '../models/Doctor.js';
import Employer from '../models/Employer.js';
import Patient from '../models/Patient.js'; // Added Patient import
import Emitra from '../models/Emitra.js'; // Added Emitra import
import healthCardService from '../services/healthCardService.js';

export const register = async (req, res) => {
  console.log('Register function hit!');
  console.log('req.body in register:', req.body); // Added log
  const {
    firstName,
    lastName,
    gender,
    dob,
    aadhaar,
    mobile,
    email,
    password,
    nativeState,
    address,
    district,
    pincode,
    bloodGroup,
    height,
    weight,
    disabilities,
    chronicConditions,
    vaccinations,
    employmentType,
    employerName,
    employerContact,
    workLocation,
    workAddress,
    duration,
    familyMembers,
    role, // Removed default 'worker' role
    specialization,
    registrationNumber,
    companyName,
    companyAddress,
    operatorId,
    centerName,
    centerLocation,
  } = req.body;

  // Basic validation
  if (!firstName || !lastName || !gender || !dob || !aadhaar || !mobile || !email || !password || !nativeState || !address || !district || !pincode) {
    return res.status(400).json({ msg: 'Please enter all required basic fields' });
  }

  // Role-specific validation
  if (role === 'doctor') {
    if (!specialization || !registrationNumber) {
      return res.status(400).json({ msg: 'Please enter all required doctor fields' });
    }
  }

  if (role === 'employer') {
    if (!companyName || !companyAddress) {
      return res.status(400).json({ msg: 'Please enter all required employer fields' });
    }
  }

  if (role === 'worker') {
    if (!bloodGroup || !height || !weight || !employmentType || !employerName || !workLocation || !workAddress) {
      return res.status(400).json({ msg: 'Please enter all required worker health and employment fields' });
    }
  }

  // Validation for patient role (similar to worker for basic health info)
  if (role === 'patient') {
    if (!bloodGroup || !height || !weight) {
      return res.status(400).json({ msg: 'Please enter all required patient health fields' });
    }
  }

  // Validation for emitra role
  if (role === 'emitra') {
    if (!operatorId || !centerName || !centerLocation) {
      return res.status(400).json({ msg: 'Please enter all required emitra fields' });
    }
  }

  console.log('Attempting registration in try block...');
  try {
    let user = await User.findOne({ email });
    console.log('After User.findOne:', user);
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    console.log('After bcrypt.genSalt');
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('After bcrypt.hash');

    user = new User({
      email,
      password: hashedPassword,
      role,
    });
    console.log('After new User:', user);

    let profile;
    switch (role) {
      case 'worker':
        profile = new Worker({
          user: user._id,
          firstName,
          lastName,
          gender,
          dob: new Date(dob), // Convert to Date object
          aadhaar,
          mobile,
          email,
          nativeState,
          address,
          district,
          pincode,
          
          bloodGroup,
          height: Number(height), // Convert to Number
          weight: Number(weight), // Convert to Number
          disabilities,
          chronicConditions: chronicConditions || [], // Ensure it's an array
          vaccinations: vaccinations || [], // Ensure it's an array
          employmentType,
          employerName,
          employerContact,
          workLocation,
          workAddress,
          duration,
          familyMembers: Number(familyMembers), // Convert to Number
          healthId: healthCardService.generateHealthId(),
        });
        console.log('After new Worker profile:', profile);
        user.worker = profile._id;
        console.log('After assigning user.worker:', user);
        break;
      case 'doctor':
        profile = new Doctor({
          user: user._id,
          firstName,
          lastName,
          gender,
          dob: new Date(dob),
          mobile,
          email,
          address,
          district,
          pincode,
          registrationNumber,
          specialization,
        });
        user.doctor = profile._id;
        break;
      case 'employer':
        profile = new Employer({
          user: user._id,
          companyName,
          mobile,
          email,
          address: companyAddress, // Use companyAddress
          district,
          pincode,
        });
        user.employer = profile._id;
        break;
      case 'patient': // Handle patient role
        profile = new Patient({
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
          disabilities,
          chronicConditions: chronicConditions || [],
          vaccinations: vaccinations || [],
          healthId: healthCardService.generateHealthId(),
        });
        user.patient = profile._id; // Link patient profile to user
        console.log('Patient profile created and linked:', profile);
        break;
      case 'emitra': // Handle emitra role
        profile = new Emitra({
          user: user._id,
          operatorId,
          fullName: `${firstName} ${lastName}`,
          email,
          centerName,
          centerLocation,
          mobile,
        });
        user.emitra = profile._id; // Link emitra profile to user
        console.log('Emitra profile created and linked:', profile);
        break;
      default:
        return res.status(400).json({ msg: 'Invalid role' });
    }

    await user.save(); // Save user first to get _id for profile
    if (profile) { // Save profile if it was created
      await profile.save();
      console.log('Profile saved successfully.');
    }
    console.log('User and profile saved successfully.');

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      async (err, token) => {
        if (err) throw err;

        let profile = null;
        switch (user.role) {
          case 'worker':
            profile = await Worker.findOne({ user: user._id });
            break;
          case 'doctor':
            profile = await Doctor.findOne({ user: user._id });
            break;
          case 'employer':
            profile = await Employer.findOne({ user: user._id });
            break;
          case 'patient':
            profile = await Patient.findOne({ user: user._id });
            break;
          case 'emitra':
            profile = await Emitra.findOne({ user: user._id });
            break;
        }

        const responseUser = {
          id: user._id,
          email: user.email,
          role: user.role,
          userType: user.role,
          name: profile ? (user.role === 'employer' ? profile.companyName : (user.role === 'emitra' ? profile.fullName : `${profile.firstName} ${profile.lastName}`)) : user.email,
          profileId: profile ? profile._id : null,
          healthId: profile && profile.healthId ? profile.healthId : null,
        };

        res.json({ token, user: responseUser });
      }
    );
  } catch (err) {
    console.log('Error caught in registration process!');
    console.error('Registration error:', err); // Log the full error object
    console.error('Request body:', req.body);
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
      // Duplicate key error (e.g., email, aadhaar, mobile already exists)
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ msg: `A user with this ${field} already exists.` });
    }
    res.status(500).send('Server error');
  }
};

export const login = async (req, res) => {
  const { emailOrId, password, userType } = req.body;

  try {
    let user;
    if (userType === 'worker') {
      const worker = await Worker.findOne({ $or: [{ email: emailOrId }, { healthId: emailOrId }] });
      if (worker) {
        user = await User.findById(worker.user);
      }
    } else if (userType === 'patient') { // Handle patient login
      const patient = await Patient.findOne({ $or: [{ email: emailOrId }, { aadhaar: emailOrId }] });
      if (patient) {
        user = await User.findById(patient.user);
      }
    } else if (userType === 'emitra') { // Handle emitra login
      const emitra = await Emitra.findOne({ $or: [{ email: emailOrId }, { operatorId: emailOrId }] });
      if (emitra) {
        user = await User.findById(emitra.user);
      }
    }
    else {
      user = await User.findOne({ email: emailOrId, role: userType });
    }


    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      async (err, token) => {
        if (err) throw err;

        let profile = null;
        switch (user.role) {
          case 'worker':
            profile = await Worker.findOne({ user: user._id });
            break;
          case 'doctor':
            profile = await Doctor.findOne({ user: user._id });
            break;
          case 'employer':
            profile = await Employer.findOne({ user: user._id });
            break;
          case 'patient':
            profile = await Patient.findOne({ user: user._id });
            break;
          case 'emitra':
            profile = await Emitra.findOne({ user: user._id });
            break;
        }

        const responseUser = {
          id: user._id,
          email: user.email,
          role: user.role,
          userType: user.role,
          name: profile ? (user.role === 'employer' ? profile.companyName : (user.role === 'emitra' ? profile.fullName : `${profile.firstName} ${profile.lastName}`)) : user.email,
          profileId: profile ? profile._id : null,
          healthId: profile && profile.healthId ? profile.healthId : null,
        };

        res.json({ token, user: responseUser });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    let profile = null;
    switch (user.role) {
      case 'worker':
        profile = await Worker.findOne({ user: user._id });
        break;
      case 'doctor':
        profile = await Doctor.findOne({ user: user._id });
        break;
      case 'employer':
        profile = await Employer.findOne({ user: user._id });
        break;
      case 'patient':
        profile = await Patient.findOne({ user: user._id }); // Fetch patient profile
        break;
      case 'emitra':
        profile = await Emitra.findOne({ user: user._id }); // Fetch emitra profile
        break;
    }

    const responseUser = {
      id: user._id,
      email: user.email,
      role: user.role, // Keep original role
      userType: user.role, // Add userType for frontend consistency
      name: profile ? (user.role === 'employer' ? profile.companyName : (user.role === 'emitra' ? profile.fullName : `${profile.firstName} ${profile.lastName}`)) : user.email, // Construct name based on role
      profileId: profile ? profile._id : null, // Add profile ID
      healthId: profile && profile.healthId ? profile.healthId : null, // Add healthId for worker/patient
      // Add other user-specific fields if needed
    };

    res.json({ user: responseUser, profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};