import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';
import Worker from './models/Worker.js';
import Patient from './models/Patient.js';
import HealthRecord from './models/HealthRecord.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SIH');
    console.log('MongoDB Connected for doctor assignment...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Assign doctors to existing patients and workers based on their health records
const assignDoctorsToPatients = async () => {
  try {
    console.log('🔄 Assigning doctors to existing patients and workers...');
    
    // Get all doctors
    const doctors = await Doctor.find();
    if (doctors.length === 0) {
      console.log('⚠️  No doctors found in database.');
      return;
    }
    
    console.log(`Found ${doctors.length} doctors in the system.`);
    
    // Get all workers
    const workers = await Worker.find();
    console.log(`Found ${workers.length} workers in the system.`);
    
    // Get all patients
    const patients = await Patient.find();
    console.log(`Found ${patients.length} patients in the system.`);
    
    // Process workers
    let workersUpdated = 0;
    for (const worker of workers) {
      // Get unique doctors from worker's health records
      const healthRecords = await HealthRecord.find({ worker: worker._id });
      const doctorIds = [...new Set(healthRecords.map(record => record.doctor.toString()))];
      
      if (doctorIds.length > 0) {
        worker.doctors = doctorIds;
        await worker.save();
        workersUpdated++;
        console.log(`✅ Assigned ${doctorIds.length} doctors to worker ${worker.firstName} ${worker.lastName}`);
      }
    }
    
    // Process patients
    let patientsUpdated = 0;
    for (const patient of patients) {
      // Get unique doctors from patient's health records
      const healthRecords = await HealthRecord.find({ patient: patient._id });
      const doctorIds = [...new Set(healthRecords.map(record => record.doctor.toString()))];
      
      if (doctorIds.length > 0) {
        patient.doctors = doctorIds;
        await patient.save();
        patientsUpdated++;
        console.log(`✅ Assigned ${doctorIds.length} doctors to patient ${patient.firstName} ${patient.lastName}`);
      }
    }
    
    console.log(`\n📊 Assignment Summary:`);
    console.log(`- Updated ${workersUpdated} workers`);
    console.log(`- Updated ${patientsUpdated} patients`);
    console.log(`\n✅ Doctor assignment process completed successfully!`);
    
  } catch (error) {
    console.error('❌ Error assigning doctors to patients:', error);
    throw error;
  }
};

// Main execution
const runDoctorAssignment = async () => {
  try {
    await connectDB();
    await assignDoctorsToPatients();
    console.log('\n✅ Doctor assignment process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Doctor assignment process failed:', error);
    process.exit(1);
  }
};

runDoctorAssignment();