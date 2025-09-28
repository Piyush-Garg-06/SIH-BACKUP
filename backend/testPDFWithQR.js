// Simple script to test PDF generation with embedded QR code
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

async function testPDFWithQR() {
  return new Promise((resolve, reject) => {
    try {
      console.log('Testing PDF generation with embedded QR code...');
      
      // QR code data
      const qrData = JSON.stringify({
        id: 'HLTH9341863BJHOX',
        name: 'Raj Kumar',
        type: 'health-card',
        issuedBy: 'Kerala Government'
      });
      
      console.log('QR data:', qrData);
      
      // Create a temporary file path for the QR code
      const tempQRPath = path.join(process.cwd(), 'test_pdf_qr.png');
      console.log('QR code will be saved to:', tempQRPath);
      
      // Generate QR code
      QRCode.toFile(tempQRPath, qrData, {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      .then(() => {
        console.log('✅ QR code generated successfully');
        
        // Check if file exists
        if (fs.existsSync(tempQRPath)) {
          const stats = fs.statSync(tempQRPath);
          console.log('✅ QR code file created');
          console.log('File size:', stats.size, 'bytes');
        } else {
          console.log('❌ QR code file not found');
          resolve(false);
          return;
        }
        
        // Now create PDF with embedded QR code
        const pdfPath = path.join(process.cwd(), 'test_pdf_with_qr.pdf');
        console.log('PDF will be saved to:', pdfPath);
        
        // Create a document
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50
        });

        // Create write stream
        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);
        
        // Add some content to the PDF
        doc.fontSize(24).fillColor('#1e40af').text('Kerala Migrant Workers', { align: 'center' });
        doc.fontSize(18).fillColor('#000000').text('Digital Health Card', { align: 'center' });
        doc.moveDown(2);
        
        // Add health card details
        doc.fontSize(12).fillColor('#000000');
        doc.text('Unique ID: HLTH9341863BJHOX');
        doc.text('Name: Raj Kumar');
        doc.text('Blood Group: O+');
        doc.moveDown(2);
        
        // Add QR code section title
        doc.fontSize(14).text('QR Code:');
        
        // Embed the QR code image in the PDF
        try {
          doc.image(tempQRPath, 50, doc.y + 10, { width: 150, height: 150 });
          console.log('✅ QR code embedded in PDF');
        } catch (error) {
          console.error('❌ Error embedding QR code in PDF:', error.message);
          // Draw a placeholder rectangle if image embedding fails
          doc.rect(50, doc.y + 10, 150, 150).stroke();
          doc.fontSize(10).text('(QR code failed to generate)', 60, doc.y + 85);
        }
        
        // Finalize the PDF and end the stream
        doc.end();
        
        // Wait for the PDF to be written
        writeStream.on('finish', () => {
          console.log('✅ PDF created successfully');
          
          // Check PDF file size
          if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            console.log('PDF file size:', stats.size, 'bytes');
            
            // Clean up the temporary QR code file
            fs.unlinkSync(tempQRPath);
            console.log('✅ Temporary files cleaned up');
            
            console.log('✅ PDF with QR code test PASSED');
            resolve(true);
          } else {
            console.log('❌ PDF file not found');
            resolve(false);
          }
        });
        
        writeStream.on('error', (err) => {
          console.error('❌ Error writing PDF:', err.message);
          // Clean up the temporary QR code file
          if (fs.existsSync(tempQRPath)) {
            fs.unlinkSync(tempQRPath);
          }
          console.log('❌ PDF with QR code test FAILED');
          resolve(false);
        });
      })
      .catch((error) => {
        console.error('❌ Error generating QR code:', error.message);
        resolve(false);
      });
    } catch (error) {
      console.error('❌ PDF with QR code test FAILED - Error:', error.message);
      console.error('Error stack:', error.stack);
      resolve(false);
    }
  });
}

// Run the test
testPDFWithQR().then((success) => {
  console.log('PDF with QR code test completed');
  process.exit(success ? 0 : 1);
});