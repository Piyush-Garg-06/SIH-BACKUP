// Simple script to test PDF download functionality
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

async function testPDFDownload() {
  try {
    console.log('Testing PDF download functionality...');
    
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
    
    // Test PDF download
    const response = await fetch(`http://localhost:5000/api/health-cards/download/${workerUser._id}`, {
      method: 'GET',
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      
      console.log('Content-Type:', contentType);
      console.log('Content-Disposition:', contentDisposition);
      
      if (contentType && contentType.includes('application/pdf')) {
        console.log('✅ PDF download test PASSED');
        return true;
      } else {
        console.log('❌ PDF download test FAILED - Incorrect content type');
        return false;
      }
    } else {
      const errorText = await response.text();
      console.log('❌ PDF download test FAILED - HTTP error:', response.status);
      console.log('Error response:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ PDF download test FAILED - Error:', error.message);
    return false;
  }
}

// Run the test
testPDFDownload().then(() => {
  console.log('Test completed');
  process.exit(0);
});