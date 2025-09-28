// Simple script to test health card data fetch functionality
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

async function testHealthCardData() {
  try {
    console.log('Testing health card data fetch functionality...');
    
    // Get a worker user
    const workerUser = await User.findOne({ email: 'worker@example.com' });
    if (!workerUser) {
      console.log('Worker user not found');
      return;
    }
    
    console.log('Found worker user:', workerUser.email);
    
    // Generate token
    const token = jwt.sign(
      { user: { id: workerUser._id } },
      process.env.JWT_SECRET,
      { expiresIn: 360000 }
    );
    
    console.log('Generated token');
    
    // Test health card data fetch
    const response = await fetch(`http://localhost:5000/api/health-cards/${workerUser._id}`, {
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data && data.data) {
        console.log('✅ Health card data fetch test PASSED');
        return true;
      } else {
        console.log('❌ Health card data fetch test FAILED - No data in response');
        return false;
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Health card data fetch test FAILED - HTTP error:', response.status);
      console.log('Error response:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Health card data fetch test FAILED - Error:', error.message);
    return false;
  }
}

// Run the test
testHealthCardData().then(() => {
  console.log('Test completed');
  process.exit(0);
});