import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Doctor from './models/Doctor.js';
import User from './models/User.js';

dotenv.config();

const checkDoctors = async () => {
  try {
    await connectDB();
    
    console.log('Checking doctors in database...');
    
    const doctors = await Doctor.find().populate('user');
    console.log(`Found ${doctors.length} doctors:`);
    
    doctors.forEach((doctor, index) => {
      console.log(`\nDoctor ${index + 1}:`);
      console.log(`  Name: ${doctor.firstName} ${doctor.lastName}`);
      console.log(`  Email: ${doctor.user ? doctor.user.email : 'No user found'}`);
      console.log(`  User ID: ${doctor.user ? doctor.user._id : 'No user found'}`);
      console.log(`  Doctor ID: ${doctor._id}`);
      console.log(`  User Reference: ${doctor.user}`);
    });
    
    console.log('\nChecking users with doctor role...');
    const doctorUsers = await User.find({ role: 'doctor' });
    console.log(`Found ${doctorUsers.length} users with doctor role:`);
    
    doctorUsers.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  User ID: ${user._id}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking doctors:', error);
    process.exit(1);
  }
};

checkDoctors();