import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Worker from './models/Worker.js';
import Doctor from './models/Doctor.js';
import Emitra from './models/Emitra.js';

dotenv.config();

const verifySpecificSeed = async () => {
  try {
    await connectDB();

    console.log('--- Verifying Seeded Data ---');
    
    // Check admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`Admin Users: ✅ Found ${adminUsers.length} users`);
    
    // Check doctor users and profiles
    const doctorUsers = await User.find({ role: 'doctor' });
    const doctorProfiles = await Doctor.find({});
    console.log(`Doctor Users: ✅ Found ${doctorUsers.length} users`);
    console.log(`Doctor Profiles: ✅ Found ${doctorProfiles.length} profiles`);
    
    // Check worker users and profiles
    const workerUsers = await User.find({ role: 'worker' });
    const workerProfiles = await Worker.find({});
    console.log(`Worker Users: ✅ Found ${workerUsers.length} users`);
    console.log(`Worker Profiles: ✅ Found ${workerProfiles.length} profiles`);
    
    // Check emitra users and profiles
    const emitraUsers = await User.find({ role: 'emitra' });
    const emitraProfiles = await Emitra.find({});
    console.log(`eMitra Users: ✅ Found ${emitraUsers.length} users`);
    console.log(`eMitra Profiles: ✅ Found ${emitraProfiles.length} profiles`);
    
    // Display details
    console.log('\n--- Detailed Information ---');
    
    console.log('\nAdmin Users:');
    for (const admin of adminUsers) {
      console.log(`  - ${admin.email}`);
    }
    
    console.log('\nDoctor Profiles:');
    for (const doctor of doctorProfiles) {
      console.log(`  - ${doctor.firstName} ${doctor.lastName} (${doctor.email}) - ${doctor.specialization}`);
    }
    
    console.log('\nWorker Profiles:');
    for (const worker of workerProfiles) {
      console.log(`  - ${worker.firstName} ${worker.lastName} (${worker.email}) - ${worker.employmentType} at ${worker.employerName}`);
    }
    
    console.log('\neMitra Profiles:');
    for (const emitra of emitraProfiles) {
      console.log(`  - ${emitra.fullName} (${emitra.operatorId}) at ${emitra.centerName}`);
    }
    
    console.log('\n--- Verification Complete ---');
    
    process.exit();
  } catch (error) {
    console.error('Error verifying seed data:', error);
    process.exit(1);
  }
};

verifySpecificSeed();