// Simple script to test QR code generation in PDF
import pdfService from './services/pdfService.js';
import fs from 'fs';
import path from 'path';

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

async function testQRCodePDF() {
  try {
    console.log('Testing QR code generation in PDF...');
    
    // Generate PDF buffer
    const pdfBuffer = await pdfService.generateHealthCardPDFBuffer(mockHealthCardData);
    
    if (pdfBuffer) {
      console.log('✅ PDF buffer generated successfully');
      console.log('PDF size:', pdfBuffer.length, 'bytes');
      
      // Save to file for manual inspection
      const outputPath = path.join(process.cwd(), 'test_health_card.pdf');
      fs.writeFileSync(outputPath, pdfBuffer);
      console.log('✅ PDF saved as', outputPath);
      console.log('✅ QR code PDF test completed');
      
      return true;
    } else {
      console.log('❌ Failed to generate PDF buffer');
      return false;
    }
  } catch (error) {
    console.error('❌ QR code PDF test FAILED - Error:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

// Run the test
testQRCodePDF().then((success) => {
  console.log('QR code PDF test completed');
  process.exit(success ? 0 : 1);
});