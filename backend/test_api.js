// Simple API testing script

const BASE_URL = 'http://localhost:5000/api';

async function testWorkerLogin() {
  try {
    console.log('Testing Worker Login...');
    
    const https = require('https');
    const http = require('http');
    
    const postData = JSON.stringify({
      emailOrId: 'worker@example.com',
      password: 'password123',
      userType: 'worker'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            console.log('Worker Login Response:', result);
            
            if (result.token) {
              console.log('✅ Worker login successful');
              resolve(result.token);
            } else {
              console.log('❌ Worker login failed');
              resolve(null);
            }
          } catch (parseError) {
            console.error('❌ Parse error:', parseError);
            resolve(null);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Worker login error:', error.message);
        resolve(null);
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error('❌ Worker login error:', error.message);
    return null;
  }
}

async function testDoctorLogin() {
  try {
    console.log('\nTesting Doctor Login...');
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrId: 'doctor@example.com',
        password: 'password123',
        userType: 'doctor'
      })
    });

    const result = await response.json();
    console.log('Doctor Login Response:', result);
    
    if (result.token) {
      console.log('✅ Doctor login successful');
      return result.token;
    } else {
      console.log('❌ Doctor login failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Doctor login error:', error.message);
    return null;
  }
}

async function testGetMe(token) {
  try {
    console.log('\nTesting /auth/me endpoint...');
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });

    const result = await response.json();
    console.log('Get Me Response:', result);
    
    if (result.user) {
      console.log('✅ Get Me successful');
      return result;
    } else {
      console.log('❌ Get Me failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Get Me error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  const workerToken = await testWorkerLogin();
  const doctorToken = await testDoctorLogin();
  
  if (workerToken) {
    await testGetMe(workerToken);
  }
  
  if (doctorToken) {
    await testGetMe(doctorToken);
  }
  
  console.log('\n✅ API Tests completed');
}

runTests().catch(console.error);