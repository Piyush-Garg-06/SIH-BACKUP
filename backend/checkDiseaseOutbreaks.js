import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import DiseaseOutbreak from './models/DiseaseOutbreak.js';

dotenv.config();

const checkDiseaseOutbreaks = async () => {
  try {
    await connectDB();
    
    console.log('Checking disease outbreaks in database...');
    
    const outbreaks = await DiseaseOutbreak.find().populate('hospital', 'name');
    console.log(`Found ${outbreaks.length} disease outbreaks:`);
    
    outbreaks.forEach((outbreak, index) => {
      console.log(`\nOutbreak ${index + 1}:`);
      console.log(`  Disease: ${outbreak.diseaseName} (${outbreak.diseaseCode})`);
      console.log(`  Location: ${outbreak.area}, ${outbreak.district}, ${outbreak.state}`);
      console.log(`  Cases: ${outbreak.casesReported}`);
      console.log(`  Severity: ${outbreak.severity}`);
      console.log(`  Hospital: ${outbreak.hospital ? outbreak.hospital.name : 'N/A'}`);
      console.log(`  Coordinates: [${outbreak.location.coordinates[0]}, ${outbreak.location.coordinates[1]}]`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking disease outbreaks:', error);
    process.exit(1);
  }
};

checkDiseaseOutbreaks();