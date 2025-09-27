import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from './models/Hospital.js';
import Doctor from './models/Doctor.js';

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const hospitals = [
  {
    name: 'Government Medical College Hospital',
    location: 'Thiruvananthapuram',
    address: 'Government Medical College, Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    pincode: '695011',
    contact: '0471-2528200',
    email: 'gmch.tvm@kerala.gov.in',
    type: 'Government',
    specialties: ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology']
  },
  {
    name: 'Sree Chitra Tirunal Institute',
    location: 'Thiruvananthapuram',
    address: 'Medical College PO, Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    state: 'Kerala',
    pincode: '695011',
    contact: '0471-2444220',
    email: 'info@sctimst.ac.in',
    type: 'Government',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Plastic Surgery']
  },
  {
    name: 'Amrita Institute of Medical Sciences',
    location: 'Kochi',
    address: 'Amrita Lane, Ponekkara, Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '682041',
    contact: '0484-2851228',
    email: 'info@aims.amrita.edu',
    type: 'Private',
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Pediatrics']
  },
  {
    name: 'Government Hospital',
    location: 'Kollam',
    address: 'Kollam City, Kerala',
    district: 'Kollam',
    state: 'Kerala',
    pincode: '691001',
    contact: '0474-2742222',
    email: 'gh.kollam@kerala.gov.in',
    type: 'Government',
    specialties: ['General Medicine', 'Pediatrics', 'Gynecology']
  },
  {
    name: 'KIMS Health',
    location: 'Trissur',
    address: 'Annamalai Road, Trissur',
    district: 'Thrissur',
    state: 'Kerala',
    pincode: '680008',
    contact: '0487-2424242',
    email: 'info@kimshealth.com',
    type: 'Private',
    specialties: ['Dermatology', 'Orthopedics', 'Cardiology', 'Gynecology']
  }
];

const doctors = [
  {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    gender: 'male',
    dob: '1980-05-15',
    mobile: '9876543210',
    email: 'rajesh.kumar@gmch.tvm.com',
    address: 'Trivandrum',
    district: 'Thiruvananthapuram',
    pincode: '695001',
    registrationNumber: 'KL/1234/2010',
    specialization: 'General Medicine',
    clinicName: 'OPD Block A',
    clinicAddress: 'Government Medical College Hospital'
  },
  {
    firstName: 'Priya',
    lastName: 'Menon',
    gender: 'female',
    dob: '1985-08-22',
    mobile: '9876543211',
    email: 'priya.menon@sctimst.com',
    address: 'Trivandrum',
    district: 'Thiruvananthapuram',
    pincode: '695002',
    registrationNumber: 'KL/2345/2012',
    specialization: 'Cardiology',
    clinicName: 'Cardiology Department',
    clinicAddress: 'Sree Chitra Tirunal Institute'
  },
  {
    firstName: 'Arun',
    lastName: 'Nair',
    gender: 'male',
    dob: '1978-12-10',
    mobile: '9876543212',
    email: 'arun.nair@aims.amrita.edu',
    address: 'Kochi',
    district: 'Ernakulam',
    pincode: '682001',
    registrationNumber: 'KL/3456/2008',
    specialization: 'Orthopedics',
    clinicName: 'Orthopedics Department',
    clinicAddress: 'Amrita Institute of Medical Sciences'
  },
  {
    firstName: 'Sneha',
    lastName: 'Pillai',
    gender: 'female',
    dob: '1983-03-30',
    mobile: '9876543213',
    email: 'sneha.pillai@kimshealth.com',
    address: 'Trissur',
    district: 'Thrissur',
    pincode: '680001',
    registrationNumber: 'KL/4567/2011',
    specialization: 'Dermatology',
    clinicName: 'Skin Clinic',
    clinicAddress: 'KIMS Health'
  },
  {
    firstName: 'Vijay',
    lastName: 'Krishnan',
    gender: 'male',
    dob: '1981-07-18',
    mobile: '9876543214',
    email: 'vijay.krishnan@gh.kollam.com',
    address: 'Kollam',
    district: 'Kollam',
    pincode: '691001',
    registrationNumber: 'KL/5678/2009',
    specialization: 'Pediatrics',
    clinicName: 'Pediatrics Department',
    clinicAddress: 'Government Hospital'
  }
];

const seedHospitals = async () => {
  try {
    // Clear existing data
    await Hospital.deleteMany({});
    console.log('Cleared existing hospitals');
    
    // Insert hospitals
    const createdHospitals = await Hospital.insertMany(hospitals);
    console.log('Inserted hospitals:', createdHospitals.length);
    
    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');
    
    // Update doctors with hospital references
    const updatedDoctors = doctors.map((doctor, index) => {
      // Assign hospitals in a round-robin fashion
      const hospitalIndex = index % createdHospitals.length;
      return {
        ...doctor,
        hospital: createdHospitals[hospitalIndex]._id
      };
    });
    
    // Insert doctors
    await Doctor.insertMany(updatedDoctors);
    console.log('Inserted doctors:', updatedDoctors.length);
    
    console.log('Hospital and doctor seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hospitals and doctors:', error);
    process.exit(1);
  }
};

// Run the seed function
seedHospitals();