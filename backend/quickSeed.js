import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import User from './models/User.js';
import Worker from './models/Worker.js';
import Patient from './models/Patient.js';

// Import health card service
import healthCardService from './services/healthCardService.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Quick test to add sample patients
const addSamplePatients = async () => {
  try {
    console.log('🌱 Adding sample patients...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Add 2 workers
    const workersData = [
      {
        email: 'worker1@test.com',
        firstName: 'Ramesh',
        lastName: 'Kumar',
        gender: 'male',
        dob: new Date('1985-06-15'),
        aadhaar: '123456789001',
        mobile: '9876543301',
        nativeState: 'Uttar Pradesh',
        address: 'Worker Quarters, Kochi',
        district: 'Ernakulam',
        pincode: '682030',
        bloodGroup: 'B+',
        height: 170,
        weight: 65,
        employmentType: 'Construction Worker',
        employerName: 'ABC Construction Ltd',
        workLocation: 'Metro Construction Site, Kochi'
      },
      {
        email: 'worker2@test.com',
        firstName: 'Suresh',
        lastName: 'Patel',
        gender: 'male',
        dob: new Date('1990-01-20'),
        aadhaar: '123456789002',
        mobile: '9876543302',
        nativeState: 'Gujarat',
        address: 'Workers Colony, Technopark',
        district: 'Thiruvananthapuram',
        pincode: '695581',
        bloodGroup: 'O+',
        height: 165,
        weight: 60,
        employmentType: 'Factory Worker',
        employerName: 'Tech Manufacturing Co',
        workLocation: 'Electronics Factory, Technopark'
      }
    ];

    // Add 2 patients
    const patientsData = [
      {
        email: 'patient1@test.com',
        firstName: 'Sita',
        lastName: 'Nair',
        gender: 'female',
        dob: new Date('1975-08-25'),
        aadhaar: '123456789101',
        mobile: '9876543501',
        nativeState: 'Kerala',
        address: 'TC Road, Thiruvananthapuram',
        district: 'Thiruvananthapuram',
        pincode: '695001',
        bloodGroup: 'A-'
      },
      {
        email: 'patient2@test.com',
        firstName: 'Maya',
        lastName: 'Pillai',
        gender: 'female',
        dob: new Date('1982-12-03'),
        aadhaar: '123456789103',
        mobile: '9876543503',
        nativeState: 'Kerala',
        address: 'Beach Road, Kozhikode',
        district: 'Kozhikode',
        pincode: '673032',
        bloodGroup: 'O+'
      }
    ];

    // Create workers
    for (const workerData of workersData) {
      const healthId = healthCardService.generateHealthId();

      const workerUser = new User({
        email: workerData.email,
        password: hashedPassword,
        role: 'worker'
      });
      await workerUser.save();

      const worker = new Worker({
        user: workerUser._id,
        firstName: workerData.firstName,
        lastName: workerData.lastName,
        gender: workerData.gender,
        dob: workerData.dob,
        aadhaar: workerData.aadhaar,
        mobile: workerData.mobile,
        email: workerData.email,
        nativeState: workerData.nativeState,
        address: workerData.address,
        district: workerData.district,
        pincode: workerData.pincode,
        bloodGroup: workerData.bloodGroup,
        height: workerData.height,
        weight: workerData.weight,
        employmentType: workerData.employmentType,
        employerName: workerData.employerName,
        workLocation: workerData.workLocation,
        healthId: healthId
      });
      await worker.save();

      console.log(`✅ Created worker: ${workerData.firstName} ${workerData.lastName}`);
    }

    // Create patients
    for (const patientData of patientsData) {
      const healthId = healthCardService.generateHealthId();

      const patientUser = new User({
        email: patientData.email,
        password: hashedPassword,
        role: 'patient'
      });
      await patientUser.save();

      const patient = new Patient({
        user: patientUser._id,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        gender: patientData.gender,
        dob: patientData.dob,
        aadhaar: patientData.aadhaar,
        mobile: patientData.mobile,
        email: patientData.email,
        nativeState: patientData.nativeState,
        address: patientData.address,
        district: patientData.district,
        pincode: patientData.pincode,
        bloodGroup: patientData.bloodGroup,
        healthId: healthId
      });
      await patient.save();

      console.log(`✅ Created patient: ${patientData.firstName} ${patientData.lastName}`);
    }

    console.log('\n🎉 Sample data created successfully!');
    console.log('📊 Summary: 2 workers + 2 patients = 4 total patients for doctors');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
};

// Main execution
const runQuickSeed = async () => {
  try {
    await connectDB();
    await addSamplePatients();
    console.log('\n✅ Quick seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Quick seeding failed:', error);
    process.exit(1);
  }
};

runQuickSeed();