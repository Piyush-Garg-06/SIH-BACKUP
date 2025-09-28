import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Doctor from './models/Doctor.js';
import User from './models/User.js';

dotenv.config();

const fixDoctorUserReferences = async () => {
  try {
    await connectDB();
    
    console.log('Fixing doctor-user references...');
    
    // Get all users with doctor role
    const doctorUsers = await User.find({ role: 'doctor' });
    console.log(`Found ${doctorUsers.length} users with doctor role`);
    
    // Get all doctors
    const doctors = await Doctor.find();
    console.log(`Found ${doctors.length} doctors`);
    
    let fixedCount = 0;
    
    // For each doctor user, find the corresponding doctor and link them
    for (const user of doctorUsers) {
      // Find a doctor with the same email (or create a mapping based on name)
      const doctor = await Doctor.findOne({ email: user.email });
      
      if (doctor) {
        // Check if the doctor already has a user reference
        if (!doctor.user) {
          doctor.user = user._id;
          await doctor.save();
          console.log(`✅ Linked doctor ${doctor.firstName} ${doctor.lastName} with user ${user.email}`);
          fixedCount++;
        } else {
          console.log(`ℹ️  Doctor ${doctor.firstName} ${doctor.lastName} already has user reference`);
        }
        
        // Also update the user's doctor reference if needed
        if (!user.doctor) {
          user.doctor = doctor._id;
          await user.save();
          console.log(`✅ Linked user ${user.email} with doctor ${doctor.firstName} ${doctor.lastName}`);
        } else {
          console.log(`ℹ️  User ${user.email} already has doctor reference`);
        }
      } else {
        console.log(`⚠️  No doctor found for user ${user.email}`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} doctor-user references`);
    
    // Verify the fix
    console.log('\nVerifying fixes...');
    const updatedDoctors = await Doctor.find().populate('user');
    updatedDoctors.forEach((doctor, index) => {
      console.log(`Doctor ${index + 1}: ${doctor.firstName} ${doctor.lastName} - User: ${doctor.user ? doctor.user.email : 'None'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing doctor-user references:', error);
    process.exit(1);
  }
};

fixDoctorUserReferences();