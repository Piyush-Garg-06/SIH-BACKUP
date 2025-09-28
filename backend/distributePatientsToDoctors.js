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
    console.log('MongoDB Connected for patient distribution...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Distribute patients among doctors
const distributePatientsToDoctors = async () => {
  try {
    console.log('🔄 Distributing patients among doctors...\n');
    
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
    console.log(`Found ${patients.length} patients in the system.\n`);
    
    // Clear all doctor assignments first
    console.log('Clearing existing doctor assignments...');
    for (const worker of workers) {
      worker.doctors = [];
      await worker.save();
    }
    
    for (const patient of patients) {
      patient.doctors = [];
      await patient.save();
    }
    
    console.log('Doctor assignments cleared.\n');
    
    // Distribute workers among doctors
    console.log('Distributing workers among doctors...');
    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      const doctorIndex = i % doctors.length; // Round-robin distribution
      const assignedDoctor = doctors[doctorIndex];
      
      worker.doctors = [assignedDoctor._id];
      await worker.save();
      
      console.log(`✅ Assigned worker ${worker.firstName} ${worker.lastName} to Dr. ${assignedDoctor.firstName} ${assignedDoctor.lastName}`);
    }
    
    // Distribute patients among doctors (if any)
    console.log('\nDistributing patients among doctors...');
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      const doctorIndex = i % doctors.length; // Round-robin distribution
      const assignedDoctor = doctors[doctorIndex];
      
      patient.doctors = [assignedDoctor._id];
      await patient.save();
      
      console.log(`✅ Assigned patient ${patient.firstName} ${patient.lastName} to Dr. ${assignedDoctor.firstName} ${assignedDoctor.lastName}`);
    }
    
    // Verify the distribution
    console.log('\n📊 Distribution Summary:');
    for (const doctor of doctors) {
      const assignedWorkers = await Worker.find({ doctors: doctor._id });
      const assignedPatients = await Patient.find({ doctors: doctor._id });
      
      console.log(`Dr. ${doctor.firstName} ${doctor.lastName}: ${assignedWorkers.length} workers, ${assignedPatients.length} patients`);
    }
    
    console.log('\n✅ Patient distribution completed successfully!');
    
  } catch (error) {
    console.error('❌ Error distributing patients to doctors:', error);
    throw error;
  }
};

// Main execution
const runDistribution = async () => {
  try {
    await connectDB();
    await distributePatientsToDoctors();
    console.log('\n✅ Patient distribution process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Patient distribution process failed:', error);
    process.exit(1);
  }
};

runDistribution();