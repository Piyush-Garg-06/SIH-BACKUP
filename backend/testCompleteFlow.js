// Simple script to test the complete authentication and health card fetch flow
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

async function testCompleteFlow() {
  try {
    console.log('Testing complete authentication and health card fetch flow...');
    
    // Step 1: Login to get a valid token
    console.log('Step 1: Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrId: 'worker@example.com',
        password: 'password123',
        userType: 'worker'
      })
    });
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', loginResponse.status, errorText);
      return false;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log('Token:', loginData.token ? 'REDACTED' : 'NOT FOUND');
    console.log('User:', loginData.user ? 'PRESENT' : 'NOT FOUND');
    
    if (!loginData.token || !loginData.user) {
      console.log('❌ Login response missing token or user');
      return false;
    }
    
    const { token, user } = loginData;
    console.log('User object:', JSON.stringify(user, null, 2));
    
    // Step 2: Fetch user profile to verify authentication
    console.log('Step 2: Fetching user profile...');
    const profileResponse = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    });
    
    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.log('❌ Profile fetch failed:', profileResponse.status, errorText);
      return false;
    }
    
    const profileData = await profileResponse.json();
    console.log('✅ Profile fetch successful');
    console.log('Profile user:', profileData.user ? 'PRESENT' : 'NOT FOUND');
    console.log('Profile user object:', JSON.stringify(profileData.user, null, 2));
    
    // Check if we have a valid user ID or profile ID
    const userId = profileData.user?._id || user._id || profileData.user?.id || user.id;
    const profileId = profileData.user?.profileId || user.profileId;
    
    let targetId = userId;
    if (!targetId && profileId) {
      console.log('Using profile ID instead of user ID');
      targetId = profileId;
    }
    
    if (!targetId) {
      console.log('❌ No valid user or profile ID found');
      console.log('Available IDs - userId:', userId, 'profileId:', profileId);
      return false;
    }
    
    console.log('Using ID:', targetId);
    
    // Step 3: Fetch health card data
    console.log('Step 3: Fetching health card data...');
    const healthCardResponse = await fetch(`http://localhost:5000/api/health-cards/${targetId}`, {
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Health card response status:', healthCardResponse.status);
    
    if (!healthCardResponse.ok) {
      const errorText = await healthCardResponse.text();
      console.log('❌ Health card fetch failed:', healthCardResponse.status, errorText);
      return false;
    }
    
    const healthCardData = await healthCardResponse.json();
    console.log('✅ Health card fetch successful');
    console.log('Health card data structure:', JSON.stringify(healthCardData, null, 2));
    
    // Verify the response structure
    if (healthCardData && healthCardData.data) {
      console.log('✅ Correct response structure found!');
      console.log('Health card unique ID:', healthCardData.data.uniqueId);
    } else {
      console.log('❌ Unexpected response structure');
      return false;
    }
    
    // Step 4: Test PDF download
    console.log('Step 4: Testing PDF download...');
    const pdfResponse = await fetch(`http://localhost:5000/api/health-cards/download/${targetId}`, {
      method: 'GET',
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('PDF download response status:', pdfResponse.status);
    console.log('PDF download response headers:', [...pdfResponse.headers.entries()]);
    
    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.log('❌ PDF download failed:', pdfResponse.status, errorText);
      return false;
    }
    
    const contentType = pdfResponse.headers.get('content-type');
    const contentDisposition = pdfResponse.headers.get('content-disposition');
    
    console.log('Content-Type:', contentType);
    console.log('Content-Disposition:', contentDisposition);
    
    if (contentType && contentType.includes('application/pdf')) {
      console.log('✅ PDF download test PASSED');
      console.log('✅ Complete flow test PASSED');
      return true;
    } else {
      console.log('❌ PDF download test FAILED - Incorrect content type');
      return false;
    }
  } catch (error) {
    console.error('❌ Complete flow test FAILED - Error:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

// Run the test
testCompleteFlow().then((success) => {
  console.log('Test completed');
  process.exit(success ? 0 : 1);
});