import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';
import Worker from './models/Worker.js';
import Patient from './models/Patient.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SIH');
    console.log('MongoDB Connected for testing...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Test doctor-patient mapping
const testDoctorPatientMapping = async () => {
  try {
    console.log('🔍 Testing doctor-patient mapping...\n');
    
    // Get all doctors
    const doctors = await Doctor.find();
    console.log(`Found ${doctors.length} doctors in the system.`);
    
    // Check each doctor's assigned patients
    for (const doctor of doctors) {
      console.log(`\n--- Doctor: Dr. ${doctor.firstName} ${doctor.lastName} ---`);
      
      // Get workers assigned to this doctor
      const workers = await Worker.find({ doctors: doctor._id });
      console.log(`Assigned Workers: ${workers.length}`);
      
      // Get patients assigned to this doctor
      const patients = await Patient.find({ doctors: doctor._id });
      console.log(`Assigned Patients: ${patients.length}`);
      
      // List the assigned patients/workers
      if (workers.length > 0) {
        console.log('Workers:');
        workers.forEach(worker => {
          console.log(`  - ${worker.firstName} ${worker.lastName}`);
        });
      }
      
      if (patients.length > 0) {
        console.log('Patients:');
        patients.forEach(patient => {
          console.log(`  - ${patient.firstName} ${patient.lastName}`);
        });
      }
      
      console.log(`Total assigned: ${workers.length + patients.length}\n`);
    }
    
    console.log('✅ Doctor-patient mapping test completed!');
    
  } catch (error) {
    console.error('❌ Error testing doctor-patient mapping:', error);
    throw error;
  }
};

// Main execution
const runTest = async () => {
  try {
    await connectDB();
    await testDoctorPatientMapping();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

runTest();