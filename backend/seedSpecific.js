import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Worker from './models/Worker.js';
import Doctor from './models/Doctor.js';
import Emitra from './models/Emitra.js';
import Patient from './models/Patient.js'; // Add Patient model import
import healthCardService from './services/healthCardService.js';

dotenv.config();

const seedSpecificUsers = async () => {
  try {
    await connectDB();

    console.log('--- Clearing Database ---');
    // Only clear the collections we're seeding
    await User.deleteMany({ role: { $in: ['admin', 'worker', 'doctor', 'emitra', 'patient'] } }); // Add 'patient' to the roles
    await Worker.deleteMany({});
    await Doctor.deleteMany({});
    await Emitra.deleteMany({});
    await Patient.deleteMany({}); // Clear Patient collection
    console.log('Database cleared for specific users.');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    console.log('--- Creating Admin Users ---');
    const adminUsersData = [
      {
        email: 'admin1@example.com',
        name: 'Admin One'
      },
      {
        email: 'admin2@example.com',
        name: 'Admin Two'
      },
      {
        email: 'admin3@example.com',
        name: 'Admin Three'
      }
    ];

    const adminUsers = [];
    for (const adminData of adminUsersData) {
      const adminUser = await new User({ 
        email: adminData.email, 
        password, 
        role: 'admin' 
      }).save();
      adminUsers.push(adminUser);
      console.log(`✅ Admin user created: ${adminData.email}`);
    }

    console.log('--- Creating Doctor Users ---');
    const doctorsData = [
      {
        email: 'dr.ramesh@hospital.com',
        firstName: 'Dr. Ramesh',
        lastName: 'Patel',
        gender: 'male',
        dob: new Date('1975-03-15'),
        mobile: '9876543001',
        specialization: 'General Physician',
        registrationNumber: 'DOC1001'
      },
      {
        email: 'dr.sunita@clinic.com',
        firstName: 'Dr. Sunita',
        lastName: 'Nair',
        gender: 'female',
        dob: new Date('1980-07-22'),
        mobile: '9876543002',
        specialization: 'Occupational Medicine',
        registrationNumber: 'DOC1002'
      },
      {
        email: 'dr.ahmed@medical.com',
        firstName: 'Dr. Ahmed',
        lastName: 'Hassan',
        gender: 'male',
        dob: new Date('1978-12-10'),
        mobile: '9876543003',
        specialization: 'Emergency Medicine',
        registrationNumber: 'DOC1003'
      }
    ];

    const doctorUsers = [];
    const doctorProfiles = [];
    for (const doctorData of doctorsData) {
      // Create user account for doctor
      const doctorUser = new User({
        email: doctorData.email,
        password,
        role: 'doctor'
      });
      await doctorUser.save();
      doctorUsers.push(doctorUser);

      // Create doctor profile
      const doctorProfile = new Doctor({
        user: doctorUser._id,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        gender: doctorData.gender,
        dob: doctorData.dob,
        mobile: doctorData.mobile,
        email: doctorData.email,
        specialization: doctorData.specialization,
        registrationNumber: doctorData.registrationNumber
      });
      await doctorProfile.save();
      doctorProfiles.push(doctorProfile);

      // Update user with doctor reference
      doctorUser.doctor = doctorProfile._id;
      await doctorUser.save();

      console.log(`✅ Doctor user created: ${doctorData.email} (${doctorData.firstName} ${doctorData.lastName})`);
    }

    // Add Patient Users section
    console.log('--- Creating Patient Users ---');
    const patientsData = [
      {
        email: 'patient1@example.com',
        firstName: 'Raj',
        lastName: 'Sharma',
        gender: 'male',
        dob: new Date('1990-05-15'),
        aadhaar: '111111111111',
        mobile: '9876543301',
        nativeState: 'Kerala',
        address: 'House No. 123, Street 4',
        district: 'Thiruvananthapuram',
        pincode: '695001',
        bloodGroup: 'A+',
        height: 175,
        weight: 70
      },
      {
        email: 'patient2@example.com',
        firstName: 'Priya',
        lastName: 'Menon',
        gender: 'female',
        dob: new Date('1985-08-22'),
        aadhaar: '222222222222',
        mobile: '9876543302',
        nativeState: 'Kerala',
        address: 'Flat 4B, Apartment Complex',
        district: 'Kochi',
        pincode: '682001',
        bloodGroup: 'O+',
        height: 160,
        weight: 55
      },
      {
        email: 'patient3@example.com',
        firstName: 'Kumar',
        lastName: 'Nair',
        gender: 'male',
        dob: new Date('1992-12-10'),
        aadhaar: '333333333333',
        mobile: '9876543303',
        nativeState: 'Kerala',
        address: 'Villa 5, Lake View',
        district: 'Kozhikode',
        pincode: '673001',
        bloodGroup: 'B+',
        height: 180,
        weight: 75
      }
    ];

    const patientUsers = [];
    const patientProfiles = [];
    for (const patientData of patientsData) {
      // Generate health ID
      const healthId = healthCardService.generateHealthId();

      // Create user account for patient
      const patientUser = new User({
        email: patientData.email,
        password,
        role: 'patient',
        healthId: healthId
      });
      await patientUser.save();
      patientUsers.push(patientUser);

      // Create patient profile
      const patientProfile = new Patient({
        user: patientUser._id,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        gender: patientData.gender,
        dob: patientData.dob,
        aadhaar: patientData.aadhaar,
        mobile: patientData.mobile,
        email: patientData.email,
        nativeState: patientData.nativeState,
        address: patientData.address,
        district: patientData.district,
        pincode: patientData.pincode,
        bloodGroup: patientData.bloodGroup,
        height: patientData.height,
        weight: patientData.weight,
        healthId: healthId
      });
      await patientProfile.save();
      patientProfiles.push(patientProfile);

      // Update user with patient reference
      patientUser.patient = patientProfile._id;
      await patientUser.save();

      console.log(`✅ Patient user created: ${patientData.email} (${patientData.firstName} ${patientData.lastName}) - Health ID: ${healthId}`);
    }

    console.log('--- Creating Worker Users ---');
    const workersData = [
      {
        email: 'ramesh.worker@gmail.com',
        firstName: 'Ramesh',
        lastName: 'Kumar',
        gender: 'male',
        dob: new Date('1985-06-15'),
        aadhaar: '123456789001',
        mobile: '9876543101',
        nativeState: 'Uttar Pradesh',
        address: 'Migrant Worker Quarters, Kakkanad',
        district: 'Ernakulam',
        pincode: '682030',
        bloodGroup: 'B+',
        height: 170,
        weight: 65,
        employmentType: 'Construction Worker',
        employerName: 'ABC Construction Ltd',
        workLocation: 'Metro Construction Site, Kochi',
        workAddress: 'Metro Rail Site, Aluva Road, Kochi'
      },
      {
        email: 'suresh.worker@gmail.com',
        firstName: 'Suresh',
        lastName: 'Patel',
        gender: 'male',
        dob: new Date('1990-01-20'),
        aadhaar: '123456789002',
        mobile: '9876543102',
        nativeState: 'Gujarat',
        address: 'Workers Colony, Technopark',
        district: 'Thiruvananthapuram',
        pincode: '695581',
        bloodGroup: 'O+',
        height: 165,
        weight: 60,
        employmentType: 'Factory Worker',
        employerName: 'Tech Manufacturing Co',
        workLocation: 'Electronics Factory, Technopark',
        workAddress: 'Technopark Phase 2, Thiruvananthapuram'
      },
      {
        email: 'vijay.worker@gmail.com',
        firstName: 'Vijay',
        lastName: 'Singh',
        gender: 'male',
        dob: new Date('1987-09-05'),
        aadhaar: '123456789003',
        mobile: '9876543103',
        nativeState: 'Bihar',
        address: 'Labour Camp, Palakkad',
        district: 'Palakkad',
        pincode: '678001',
        bloodGroup: 'A+',
        height: 172,
        weight: 70,
        employmentType: 'Agricultural Worker',
        employerName: 'Green Valley Farms',
        workLocation: 'Rice Fields, Palakkad',
        workAddress: 'Kanjikode, Palakkad'
      }
    ];

    const workerUsers = [];
    const workerProfiles = [];
    for (const workerData of workersData) {
      // Generate health ID
      const healthId = healthCardService.generateHealthId();

      // Create user account for worker
      const workerUser = new User({
        email: workerData.email,
        password,
        role: 'worker',
        healthId: healthId
      });
      await workerUser.save();
      workerUsers.push(workerUser);

      // Create worker profile
      const workerProfile = new Worker({
        user: workerUser._id,
        firstName: workerData.firstName,
        lastName: workerData.lastName,
        gender: workerData.gender,
        dob: workerData.dob,
        aadhaar: workerData.aadhaar,
        mobile: workerData.mobile,
        email: workerData.email,
        nativeState: workerData.nativeState,
        address: workerData.address,
        district: workerData.district,
        pincode: workerData.pincode,
        bloodGroup: workerData.bloodGroup,
        height: workerData.height,
        weight: workerData.weight,
        employmentType: workerData.employmentType,
        employerName: workerData.employerName,
        workLocation: workerData.workLocation,
        workAddress: workerData.workAddress,
        healthId: healthId
      });
      await workerProfile.save();
      workerProfiles.push(workerProfile);

      // Update user with worker reference
      workerUser.worker = workerProfile._id;
      await workerUser.save();

      console.log(`✅ Worker user created: ${workerData.email} (${workerData.firstName} ${workerData.lastName}) - Health ID: ${healthId}`);
    }

    console.log('--- Creating eMitra Users ---');
    const emitraUsersData = [
      {
        email: 'emitra1@example.com',
        operatorId: 'EM-101',
        fullName: 'Rajesh Kumar',
        centerName: 'eMitra Center Thiruvananthapuram',
        centerLocation: 'Statue, Thiruvananthapuram, Kerala',
        mobile: '9876543201'
      },
      {
        email: 'emitra2@example.com',
        operatorId: 'EM-102',
        fullName: 'Sunita Sharma',
        centerName: 'eMitra Center Kochi',
        centerLocation: 'MG Road, Kochi, Kerala',
        mobile: '9876543202'
      },
      {
        email: 'emitra3@example.com',
        operatorId: 'EM-103',
        fullName: 'Ahmed Hassan',
        centerName: 'eMitra Center Kozhikode',
        centerLocation: 'Beach Road, Kozhikode, Kerala',
        mobile: '9876543203'
      }
    ];

    const emitraUsers = [];
    const emitraProfiles = [];
    for (const emitraData of emitraUsersData) {
      // Create user account for emitra
      const emitraUser = new User({
        email: emitraData.email,
        password,
        role: 'emitra'
      });
      await emitraUser.save();
      emitraUsers.push(emitraUser);

      // Create emitra profile
      const emitraProfile = new Emitra({
        user: emitraUser._id,
        operatorId: emitraData.operatorId,
        fullName: emitraData.fullName,
        email: emitraData.email,
        centerName: emitraData.centerName,
        centerLocation: emitraData.centerLocation,
        mobile: emitraData.mobile
      });
      await emitraProfile.save();
      emitraProfiles.push(emitraProfile);

      // Update user with emitra reference
      emitraUser.emitra = emitraProfile._id;
      await emitraUser.save();

      console.log(`✅ eMitra user created: ${emitraData.email} (${emitraData.operatorId})`);
    }

    console.log('\n--- Database Seeded Successfully! ---');
    console.log('\n--- Login Credentials ---');
    console.log('Password for all users: password123');
    
    console.log('\nAdmin Users:');
    adminUsersData.forEach((admin, index) => {
      console.log(`  ${index + 1}. ${admin.email}`);
    });
    
    console.log('\nDoctor Users:');
    doctorsData.forEach((doctor, index) => {
      console.log(`  ${index + 1}. ${doctor.email} (${doctor.firstName} ${doctor.lastName})`);
    });
    
    // Add Patient Users to the output
    console.log('\nPatient Users:');
    patientsData.forEach((patient, index) => {
      console.log(`  ${index + 1}. ${patient.email} (${patient.firstName} ${patient.lastName})`);
    });
    
    console.log('\nWorker Users:');
    workersData.forEach((worker, index) => {
      console.log(`  ${index + 1}. ${worker.email} (${worker.firstName} ${worker.lastName})`);
    });
    
    console.log('\neMitra Users:');
    emitraUsersData.forEach((emitra, index) => {
      console.log(`  ${index + 1}. ${emitra.email} (${emitra.operatorId})`);
    });

    process.exit();
  } catch (error) {
    console.error('Error seeding specific users:', error);
    process.exit(1);
  }
};

seedSpecificUsers();