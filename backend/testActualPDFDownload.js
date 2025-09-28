// Simple script to test actual PDF download with QR code
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

async function testActualPDFDownload() {
  try {
    console.log('Testing actual PDF download with QR code...');
    
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
    
    const { token, user } = loginData;
    const userId = user._id || user.id;
    
    // Step 2: Download health card PDF
    console.log('Step 2: Downloading health card PDF...');
    const pdfResponse = await fetch(`http://localhost:5000/api/health-cards/download/${userId}`, {
      method: 'GET',
      headers: {
        'x-auth-token': token
      }
    });
    
    console.log('PDF download response status:', pdfResponse.status);
    
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
      // Get the PDF data as buffer
      const pdfBuffer = await pdfResponse.buffer();
      console.log('✅ PDF downloaded successfully');
      console.log('PDF size:', pdfBuffer.length, 'bytes');
      
      // Save to file for manual inspection
      const outputPath = path.join(process.cwd(), 'actual_health_card_download.pdf');
      fs.writeFileSync(outputPath, pdfBuffer);
      console.log('✅ PDF saved as', outputPath);
      
      // Check if PDF contains QR code indicators
      const pdfString = pdfBuffer.toString('utf8');
      if (pdfString.includes('QR Code') || pdfString.includes('qrcode')) {
        console.log('✅ PDF contains QR code references');
      } else {
        console.log('⚠️  PDF may not contain QR code (check visually)');
      }
      
      console.log('✅ Actual PDF download test PASSED');
      return true;
    } else {
      console.log('❌ PDF download test FAILED - Incorrect content type');
      return false;
    }
  } catch (error) {
    console.error('❌ Actual PDF download test FAILED - Error:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

// Run the test
testActualPDFDownload().then((success) => {
  console.log('Actual PDF download test completed');
  process.exit(success ? 0 : 1);
});