import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Worker from './models/Worker.js';
import Doctor from './models/Doctor.js';
import Emitra from './models/Emitra.js';
import Hospital from './models/Hospital.js';
import healthCardService from './services/healthCardService.js';

dotenv.config();

const seedAll = async () => {
  try {
    await connectDB();

    console.log('--- Clearing Database ---');
    // Clear all collections
    await User.deleteMany({});
    await Worker.deleteMany({});
    await Doctor.deleteMany({});
    await Emitra.deleteMany({});
    await Hospital.deleteMany({});
    console.log('Database cleared.');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    console.log('--- Creating Hospitals ---');
    const hospitalsData = [
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
        specialties: ['General Medicine', 'Cardiology', 'Orthopedics']
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
        specialties: ['Cardiology', 'Neurology', 'Orthopedics']
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
        specialties: ['Cardiology', 'Oncology', 'Neurology']
      }
    ];

    const createdHospitals = await Hospital.insertMany(hospitalsData);
    console.log('✅ Hospitals created:', createdHospitals.length);

    console.log('--- Creating Users ---');
    // Create admin users
    const adminUsers = [];
    const adminEmails = ['admin1@example.com', 'admin2@example.com', 'admin3@example.com'];
    for (let i = 0; i < 3; i++) {
      const adminUser = await new User({ 
        email: adminEmails[i], 
        password, 
        role: 'admin' 
      }).save();
      adminUsers.push(adminUser);
    }

    // Create emitra users
    const emitraUsersData = [
      {
        email: 'emitra1@example.com',
        operatorId: 'EM-001',
        fullName: 'Rajesh Kumar',
        centerName: 'eMitra Center Thiruvananthapuram',
        centerLocation: 'Statue, Thiruvananthapuram, Kerala',
        mobile: '9876543210'
      },
      {
        email: 'emitra2@example.com',
        operatorId: 'EM-002',
        fullName: 'Sunita Sharma',
        centerName: 'eMitra Center Kochi',
        centerLocation: 'MG Road, Kochi, Kerala',
        mobile: '9876543211'
      },
      {
        email: 'emitra3@example.com',
        operatorId: 'EM-003',
        fullName: 'Ahmed Hassan',
        centerName: 'eMitra Center Kozhikode',
        centerLocation: 'Beach Road, Kozhikode, Kerala',
        mobile: '9876543212'
      }
    ];

    const emitraUsers = [];
    const emitraProfiles = [];
    for (const emitraData of emitraUsersData) {
      const emitraUser = await new User({
        email: emitraData.email,
        password,
        role: 'emitra'
      }).save();
      
      const emitraProfile = await new Emitra({
        user: emitraUser._id,
        operatorId: emitraData.operatorId,
        fullName: emitraData.fullName,
        email: emitraData.email,
        centerName: emitraData.centerName,
        centerLocation: emitraData.centerLocation,
        mobile: emitraData.mobile
      }).save();
      
      emitraUser.emitra = emitraProfile._id;
      await emitraUser.save();
      
      emitraUsers.push(emitraUser);
      emitraProfiles.push(emitraProfile);
    }

    // Create worker users
    const workerEmails = ['worker1@example.com', 'worker2@example.com', 'worker3@example.com'];
    const workerUsers = [];
    for (let i = 0; i < 3; i++) {
      const workerUser = await new User({ 
        email: workerEmails[i], 
        password, 
        role: 'worker' 
      }).save();
      workerUsers.push(workerUser);
    }

    // Create doctor users
    const doctorEmails = ['doctor1@example.com', 'doctor2@example.com', 'doctor3@example.com'];
    const doctorUsers = [];
    for (let i = 0; i < 3; i++) {
      const doctorUser = await new User({ 
        email: doctorEmails[i], 
        password, 
        role: 'doctor' 
      }).save();
      doctorUsers.push(doctorUser);
    }
    console.log('✅ Users created.');

    console.log('--- Creating Worker Profiles ---');
    const workerProfiles = [];
    const workerProfilesData = [
      {
        firstName: 'Raj', lastName: 'Kumar', gender: 'male', dob: new Date('1990-01-01'),
        aadhaar: '111122223333', mobile: '9876543210', email: 'worker1@example.com',
        nativeState: 'Bihar', bloodGroup: 'O+', height: 170, weight: 65,
        employmentType: 'Construction', employerName: 'Big Builders', workLocation: 'Mumbai',
        healthId: healthCardService.generateHealthId(),
      },
      {
        firstName: 'Amit', lastName: 'Patel', gender: 'male', dob: new Date('1985-05-15'),
        aadhaar: '222233334444', mobile: '9876543211', email: 'worker2@example.com',
        nativeState: 'Gujarat', bloodGroup: 'B+', height: 175, weight: 70,
        employmentType: 'Manufacturing', employerName: 'Tech Manufacturing', workLocation: 'Bangalore',
        healthId: healthCardService.generateHealthId(),
      },
      {
        firstName: 'Suresh', lastName: 'Reddy', gender: 'male', dob: new Date('1992-08-20'),
        aadhaar: '333344445555', mobile: '9876543212', email: 'worker3@example.com',
        nativeState: 'Telangana', bloodGroup: 'A-', height: 168, weight: 62,
        employmentType: 'Construction', employerName: 'Urban Constructors', workLocation: 'Hyderabad',
        healthId: healthCardService.generateHealthId(),
      }
    ];

    for (let i = 0; i < 3; i++) {
      const workerProfile = await new Worker({
        user: workerUsers[i]._id,
        ...workerProfilesData[i]
      }).save();
      
      workerUsers[i].worker = workerProfile._id;
      await workerUsers[i].save();
      workerProfiles.push(workerProfile);
    }
    console.log('✅ Worker profiles created:', workerProfiles.length);

    console.log('--- Creating Doctor Profiles ---');
    const doctorProfiles = [];
    const doctorProfilesData = [
      {
        firstName: 'Sunita', lastName: 'Sharma', gender: 'female', dob: new Date('1980-05-10'),
        mobile: '9876543213', email: 'doctor1@example.com',
        specialization: 'General Physician', registrationNumber: 'DOC12345',
        hospital: createdHospitals[0]._id // Government Medical College Hospital
      },
      {
        firstName: 'Ramesh', lastName: 'Iyer', gender: 'male', dob: new Date('1975-12-03'),
        mobile: '9876543214', email: 'doctor2@example.com',
        specialization: 'Cardiology', registrationNumber: 'DOC23456',
        hospital: createdHospitals[1]._id // Sree Chitra Tirunal Institute
      },
      {
        firstName: 'Priya', lastName: 'Nair', gender: 'female', dob: new Date('1983-07-18'),
        mobile: '9876543215', email: 'doctor3@example.com',
        specialization: 'Orthopedics', registrationNumber: 'DOC34567',
        hospital: createdHospitals[2]._id // Amrita Institute of Medical Sciences
      }
    ];

    for (let i = 0; i < 3; i++) {
      const doctorProfile = await new Doctor({
        user: doctorUsers[i]._id,
        ...doctorProfilesData[i]
      }).save();
      
      doctorUsers[i].doctor = doctorProfile._id;
      await doctorUsers[i].save();
      doctorProfiles.push(doctorProfile);
    }
    console.log('✅ Doctor profiles created:', doctorProfiles.length);

    console.log('\n--- Database Seeded Successfully! ---');
    console.log('\n--- Login Credentials ---');
    console.log('Password for all users: password123');
    console.log('\nAdmins:');
    adminUsers.forEach((admin, index) => {
      console.log(`  Admin ${index + 1}: ${admin.email}`);
    });
    console.log('\neMitra Operators:');
    emitraUsersData.forEach((emitra, index) => {
      console.log(`  eMitra ${index + 1}: ${emitra.email} (${emitra.operatorId})`);
    });
    console.log('\nWorkers:');
    workerEmails.forEach((email, index) => {
      console.log(`  Worker ${index + 1}: ${email}`);
    });
    console.log('\nDoctors:');
    doctorEmails.forEach((email, index) => {
      console.log(`  Doctor ${index + 1}: ${email}`);
    });
    console.log('\nHospitals:');
    createdHospitals.forEach((hospital, index) => {
      console.log(`  Hospital ${index + 1}: ${hospital.name}`);
    });

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedAll();