import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import DiseaseOutbreak from './models/DiseaseOutbreak.js';
import Hospital from './models/Hospital.js';
import User from './models/User.js';

dotenv.config();

const seedDiseaseOutbreaks = async () => {
  try {
    await connectDB();
    
    console.log('Seeding sample disease outbreaks...');
    
    // Clear existing outbreaks
    await DiseaseOutbreak.deleteMany();
    console.log('Cleared existing disease outbreaks');
    
    // Get a hospital for the outbreaks
    const hospital = await Hospital.findOne();
    if (!hospital) {
      console.log('No hospitals found in database. Please seed hospitals first.');
      process.exit(1);
    }
    
    // Get a doctor user for reporting
    const doctorUser = await User.findOne({ role: 'doctor' });
    if (!doctorUser) {
      console.log('No doctor users found in database. Please seed users first.');
      process.exit(1);
    }
    
    // Sample disease outbreaks data
    const outbreaksData = [
      {
        diseaseName: 'Dengue Fever',
        diseaseCode: 'DENGV',
        location: {
          type: 'Point',
          coordinates: [76.2711, 10.8505] // [longitude, latitude]
        },
        area: 'Central Trivandrum',
        district: 'Thiruvananthapuram',
        state: 'Kerala',
        pincode: '695001',
        hospital: hospital._id,
        casesReported: 15,
        severity: 'high',
        symptoms: ['Fever', 'Headache', 'Joint Pain', 'Rash'],
        affectedAgeGroups: ['19-30', '0-5'],
        transmissionType: 'vector-borne',
        containmentMeasures: ['Mosquito control', 'Public awareness'],
        notes: 'Increased cases reported in the last week'
      },
      {
        diseaseName: 'Respiratory Infection',
        diseaseCode: 'RESINF',
        location: {
          type: 'Point',
          coordinates: [76.4211, 10.2505] // [longitude, latitude]
        },
        area: 'Medical College Campus',
        district: 'Kozhikode',
        state: 'Kerala',
        pincode: '673001',
        hospital: hospital._id,
        casesReported: 8,
        severity: 'moderate',
        symptoms: ['Cough', 'Fever', 'Difficulty Breathing'],
        affectedAgeGroups: ['65+', '0-5'],
        transmissionType: 'airborne',
        containmentMeasures: ['Isolation protocols', 'Sanitization'],
        notes: 'Seasonal outbreak during winter months'
      },
      {
        diseaseName: 'Gastroenteritis',
        diseaseCode: 'GASTR',
        location: {
          type: 'Point',
          coordinates: [76.7711, 9.9312] // [longitude, latitude]
        },
        area: 'Industrial Area',
        district: 'Ernakulam',
        state: 'Kerala',
        pincode: '682001',
        hospital: hospital._id,
        casesReported: 12,
        severity: 'moderate',
        symptoms: ['Diarrhea', 'Vomiting', 'Dehydration'],
        affectedAgeGroups: ['19-30', '0-5'],
        transmissionType: 'foodborne',
        containmentMeasures: ['Water quality checks', 'Food safety measures'],
        notes: 'Linked to contaminated water supply'
      }
    ];
    
    // Create outbreaks
    const createdOutbreaks = [];
    for (const outbreakData of outbreaksData) {
      const outbreak = new DiseaseOutbreak({
        ...outbreakData,
        reportedBy: doctorUser._id,
        reportedByRole: 'doctor',
        hospitalName: hospital.name
      });
      
      const createdOutbreak = await outbreak.save();
      createdOutbreaks.push(createdOutbreak);
      console.log(`✅ Created outbreak: ${outbreakData.diseaseName} in ${outbreakData.area}`);
    }
    
    console.log(`\n✅ Successfully created ${createdOutbreaks.length} disease outbreaks`);
    
    // Verify creation
    const outbreaks = await DiseaseOutbreak.find().populate('hospital', 'name');
    console.log(`\nTotal outbreaks in database: ${outbreaks.length}`);
    
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
    console.error('Error seeding disease outbreaks:', error);
    process.exit(1);
  }
};

seedDiseaseOutbreaks();