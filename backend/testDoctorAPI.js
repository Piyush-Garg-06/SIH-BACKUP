import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const testDoctorAPI = async () => {
  try {
    await connectDB();
    
    console.log('Testing doctor API access...');
    
    // Find a doctor user
    const doctorUser = await User.findOne({ role: 'doctor', email: 'dr.sunita@healthcare.gov' });
    
    if (!doctorUser) {
      console.log('❌ No doctor user found');
      process.exit(1);
    }
    
    console.log(`✅ Found doctor user: ${doctorUser.email}`);
    
    // Generate a valid token for this user
    const payload = {
      user: {
        id: doctorUser.id,
        role: doctorUser.role
      }
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(`✅ Generated token: ${token.substring(0, 20)}...`);
    
    // Test the API endpoint using fetch
    const response = await fetch('http://localhost:5000/api/doctors/profile', {
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing doctor API:', error);
    process.exit(1);
  }
};

testDoctorAPI();