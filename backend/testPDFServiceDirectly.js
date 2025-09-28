// Simple script to test PDF service directly
import pdfService from './services/pdfService.js';
import fs from 'fs';

async function testPDFServiceDirectly() {
  try {
    console.log('Testing PDF service directly...');
    
    // Mock health card data
    const mockHealthCardData = {
      healthId: 'HLTH9341863BJHOX',
      name: 'Raj Kumar',
      dateOfBirth: '1990-01-01',
      bloodGroup: 'O+',
      mobile: '9876543210',
      email: 'worker@example.com',
      address: 'Test Address',
      district: 'Test District',
      issueDate: new Date(),
      validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    };
    
    console.log('Generating PDF buffer...');
    
    // Generate PDF buffer
    const pdfBuffer = await pdfService.generateHealthCardPDFBuffer(mockHealthCardData);
    
    if (pdfBuffer) {
      console.log('✅ PDF buffer generated successfully');
      console.log('PDF size:', pdfBuffer.length, 'bytes');
      
      // Save to file for manual inspection
      fs.writeFileSync('direct_service_test.pdf', pdfBuffer);
      console.log('✅ PDF saved as direct_service_test.pdf');
      
      // Check if PDF is larger than the one without QR code
      if (pdfBuffer.length > 2000) {
        console.log('✅ PDF likely contains QR code (size > 2000 bytes)');
      } else {
        console.log('⚠️  PDF may not contain QR code (size <= 2000 bytes)');
      }
      
      console.log('✅ PDF service direct test PASSED');
      return true;
    } else {
      console.log('❌ Failed to generate PDF buffer');
      return false;
    }
  } catch (error) {
    console.error('❌ PDF service direct test FAILED - Error:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

// Run the test
testPDFServiceDirectly().then((success) => {
  console.log('PDF service direct test completed');
  process.exit(success ? 0 : 1);
});