// Simple script to test QR code generation only
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function testQRCodeOnly() {
  try {
    console.log('Testing QR code generation only...');
    
    // QR code data
    const qrData = JSON.stringify({
      id: 'HLTH9341863BJHOX',
      name: 'Raj Kumar',
      type: 'health-card',
      issuedBy: 'Kerala Government'
    });
    
    console.log('QR data:', qrData);
    
    // Create a temporary file path for the QR code
    const tempQRPath = path.join(process.cwd(), 'test_qr_only.png');
    console.log('QR code will be saved to:', tempQRPath);
    
    // Generate QR code
    await QRCode.toFile(tempQRPath, qrData, {
      width: 150,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    console.log('✅ QR code generated successfully');
    
    // Check if file exists
    if (fs.existsSync(tempQRPath)) {
      const stats = fs.statSync(tempQRPath);
      console.log('✅ QR code file created');
      console.log('File size:', stats.size, 'bytes');
      
      // Clean up
      fs.unlinkSync(tempQRPath);
      console.log('✅ QR code file cleaned up');
    } else {
      console.log('❌ QR code file not found');
    }
    
    console.log('✅ QR code only test PASSED');
    return true;
  } catch (error) {
    console.error('❌ QR code only test FAILED - Error:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

// Run the test
testQRCodeOnly().then((success) => {
  console.log('QR code only test completed');
  process.exit(success ? 0 : 1);
});