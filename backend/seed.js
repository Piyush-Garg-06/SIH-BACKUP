import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Worker from './models/Worker.js';
import Doctor from './models/Doctor.js';
import Employer from './models/Employer.js';
import Patient from './models/Patient.js';
import Emitra from './models/Emitra.js';
import HealthRecord from './models/HealthRecord.js';
import Appointment from './models/Appointment.js';
import healthCardService from './services/healthCardService.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('--- Clearing Database ---');
    await Appointment.deleteMany();
    await HealthRecord.deleteMany();
    await Patient.deleteMany();
    await Employer.deleteMany();
    await Doctor.deleteMany();
    await Worker.deleteMany();
    await Emitra.deleteMany();
    await User.deleteMany();
    console.log('Database cleared.');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    console.log('--- Creating Users ---');
    const adminUser = await new User({ email: 'admin@example.com', password, role: 'admin' }).save();
    const workerUser = await new User({ email: 'worker@example.com', password, role: 'worker' }).save();
    const doctorUser = await new User({ email: 'doctor@example.com', password, role: 'doctor' }).save();
    const employerUser = await new User({ email: 'employer@example.com', password, role: 'employer' }).save();
    const patientUser = await new User({ email: 'patient@example.com', password, role: 'patient' }).save();
    
    // Create emitra users
    const emitraUser1 = await new User({ email: 'emitra1@example.com', password, role: 'emitra' }).save();
    const emitraUser2 = await new User({ email: 'emitra2@example.com', password, role: 'emitra' }).save();
    console.log('Users created.');

    console.log('--- Creating Profiles ---');
    const workerProfile = await new Worker({
        user: workerUser._id,
        firstName: 'Raj', lastName: 'Kumar', gender: 'male', dob: new Date('1990-01-01'),
        aadhaar: '111122223333', mobile: '9876543210', email: 'worker@example.com',
        nativeState: 'Bihar', bloodGroup: 'O+', height: 170, weight: 65,
        employmentType: 'Construction', employerName: 'Big Builders', workLocation: 'Mumbai',
        healthId: healthCardService.generateHealthId(),
    }).save();

    const doctorProfile = await new Doctor({
        user: doctorUser._id,
        firstName: 'Sunita', lastName: 'Sharma', gender: 'female', dob: new Date('1980-05-10'),
        mobile: '9876543211', email: 'doctor@example.com',
        specialization: 'General Physician', registrationNumber: 'DOC12345',
    }).save();

    const employerProfile = await new Employer({
        user: employerUser._id,
        companyName: 'Big Builders', mobile: '9876543212', email: 'employer@example.com',
        address: '123 Construction Lane, Mumbai'
    }).save();

    const patientProfile = await new Patient({
        user: patientUser._id,
        firstName: 'Geeta', lastName: 'Das', gender: 'female', dob: new Date('1995-03-12'),
        aadhaar: '444455556666', mobile: '9876543213', email: 'patient@example.com',
        nativeState: 'West Bengal', bloodGroup: 'A+', height: 160, weight: 55,
        healthId: healthCardService.generateHealthId(),
    }).save();
    
    // Create emitra profiles
    const emitraProfile1 = await new Emitra({
        user: emitraUser1._id,
        operatorId: 'EM-001',
        fullName: 'Rajesh Kumar',
        email: 'emitra1@example.com',
        centerName: 'eMitra Center Thiruvananthapuram',
        centerLocation: 'Statue, Thiruvananthapuram, Kerala',
        mobile: '9876543214'
    }).save();
    
    const emitraProfile2 = await new Emitra({
        user: emitraUser2._id,
        operatorId: 'EM-002',
        fullName: 'Sunita Sharma',
        email: 'emitra2@example.com',
        centerName: 'eMitra Center Kochi',
        centerLocation: 'MG Road, Kochi, Kerala',
        mobile: '9876543215'
    }).save();
    console.log('Profiles created.');

    console.log('--- Linking Profiles to Users ---');
    workerUser.worker = workerProfile._id;
    await workerUser.save();

    doctorUser.doctor = doctorProfile._id;
    await doctorUser.save();

    employerUser.employer = employerProfile._id;
    await employerUser.save();

    patientUser.patient = patientProfile._id;
    await patientUser.save();
    
    // Link emitra profiles
    emitraUser1.emitra = emitraProfile1._id;
    await emitraUser1.save();
    
    emitraUser2.emitra = emitraProfile2._id;
    await emitraUser2.save();
    console.log('Profiles linked.');

    console.log('--- Creating Sample Data ---');
    await HealthRecord.insertMany([
        {
            worker: workerProfile._id,
            doctor: doctorProfile._id,
            diagnosis: 'Annual Health Checkup', symptoms: 'None', treatment: 'None',
            severity: 'normal', date: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            tests: ['Blood Test', 'X-Ray'], hospitalName: 'City General Hospital'
        },
        {
            worker: workerProfile._id,
            doctor: doctorProfile._id,
            diagnosis: 'Viral Fever', symptoms: 'Fever, Headache, Body Ache', treatment: 'Paracetamol',
            severity: 'moderate', date: new Date(new Date().setMonth(new Date().getMonth() - 2)),
            prescriptions: ['Tab Paracetamol 500mg'], hospitalName: 'City General Hospital',
            followUpDate: new Date(new Date().setMonth(new Date().getMonth() - 2) + 7 * 24 * 60 * 60 * 1000)
        },
        {
            worker: workerProfile._id,
            doctor: doctorProfile._id,
            diagnosis: 'Minor Injury', symptoms: 'Cut on left hand', treatment: 'Dressing and Tetanus shot',
            severity: 'normal', date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            hospitalName: 'Local Clinic'
        },
        {
            patient: patientProfile._id,
            doctor: doctorProfile._id,
            diagnosis: 'Common Cold', symptoms: 'Cough and sore throat', treatment: 'Rest and fluids',
            severity: 'normal', date: new Date(new Date().setDate(new Date().getDate() - 10))
        }
    ]);

    await new Appointment({
        worker: workerProfile._id,
        doctor: doctorProfile._id,
        date: new Date(new Date().setDate(new Date().getDate() + 7)),
        time: '10:00 AM',
        type: 'Health Checkup',
    }).save();
    console.log('Sample data created.');

    console.log('\n--- Database Seeded Successfully! ---');
    console.log('\n--- Login Credentials ---');
    console.log('Password for all users: password123');
    console.log(`Admin:    ${adminUser.email}`);
    console.log(`Worker:   ${workerUser.email}`);
    console.log(`Doctor:   ${doctorUser.email}`);
    console.log(`Employer: ${employerUser.email}`);
    console.log(`Patient:  ${patientUser.email}`);
    console.log(`eMitra 1: ${emitraUser1.email} (Operator ID: EM-001)`);
    console.log(`eMitra 2: ${emitraUser2.email} (Operator ID: EM-002)`);

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();