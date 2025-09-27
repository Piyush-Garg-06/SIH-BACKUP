import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Worker from './models/Worker.js';
import Patient from './models/Patient.js';
import HealthRecord from './models/HealthRecord.js';
import Appointment from './models/Appointment.js';

// Import health card service
import healthCardService from './services/healthCardService.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Generate dummy data
const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Doctor.deleteMany({});
    // await Worker.deleteMany({});
    // await Patient.deleteMany({});
    // await HealthRecord.deleteMany({});
    // await Appointment.deleteMany({});
    // console.log('✅ Cleared existing data');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // ===== CREATE DOCTORS =====
    console.log('👨‍⚕️ Creating doctors...');
    
    const doctorsData = [
      {
        email: 'dr.rajesh@healthcenter.com',
        firstName: 'Dr. Rajesh',
        lastName: 'Kumar',
        gender: 'male',
        dob: new Date('1975-03-15'),
        mobile: '9876543201',
        address: 'Medical College Road, Thiruvananthapuram',
        district: 'Thiruvananthapuram',
        pincode: '695011',
        registrationNumber: 'KMC12345',
        specialization: 'General Medicine',
        clinicName: 'Kumar Medical Center',
        clinicAddress: 'Near Civil Station, Thiruvananthapuram'
      },
      {
        email: 'dr.priya@hospital.com',
        firstName: 'Dr. Priya',
        lastName: 'Nair',
        gender: 'female',
        dob: new Date('1980-07-22'),
        mobile: '9876543202',
        address: 'MG Road, Kochi',
        district: 'Ernakulam',
        pincode: '682016',
        registrationNumber: 'KMC12346',
        specialization: 'Occupational Medicine',
        clinicName: 'Nair Health Clinic',
        clinicAddress: 'Marine Drive, Kochi'
      },
      {
        email: 'dr.ahmed@clinic.com',
        firstName: 'Dr. Ahmed',
        lastName: 'Hassan',
        gender: 'male',
        dob: new Date('1978-12-10'),
        mobile: '9876543203',
        address: 'Calicut Road, Kozhikode',
        district: 'Kozhikode',
        pincode: '673001',
        registrationNumber: 'KMC12347',
        specialization: 'Emergency Medicine',
        clinicName: 'Hassan Emergency Care',
        clinicAddress: 'Beach Road, Kozhikode'
      }
    ];

    const doctors = [];
    for (const doctorData of doctorsData) {
      // Create user account for doctor
      const doctorUser = new User({
        email: doctorData.email,
        password: hashedPassword,
        role: 'doctor',
        userType: 'doctor'
      });
      await doctorUser.save();

      // Create doctor profile
      const doctor = new Doctor({
        user: doctorUser._id,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        gender: doctorData.gender,
        dob: doctorData.dob,
        mobile: doctorData.mobile,
        email: doctorData.email,
        address: doctorData.address,
        district: doctorData.district,
        pincode: doctorData.pincode,
        registrationNumber: doctorData.registrationNumber,
        specialization: doctorData.specialization,
        clinicName: doctorData.clinicName,
        clinicAddress: doctorData.clinicAddress
      });
      await doctor.save();

      // Update user with doctor reference
      doctorUser.doctor = doctor._id;
      await doctorUser.save();

      doctors.push(doctor);
      console.log(`✅ Created doctor: ${doctorData.firstName} ${doctorData.lastName}`);
    }

    // ===== CREATE WORKERS =====
    console.log('👷‍♂️ Creating migrant workers...');
    
    const workersData = [
      {
        email: 'ramesh.worker@gmail.com',
        firstName: 'Ramesh',
        lastName: 'Kumar',
        gender: 'male',
        dob: new Date('1985-06-15'),
        aadhaar: '123456789001',
        mobile: '9876543301',
        nativeState: 'Uttar Pradesh',
        address: 'Migrant Worker Quarters, Kakkanad',
        district: 'Ernakulam',
        pincode: '682030',
        bloodGroup: 'B+',
        height: 170,
        weight: 65,
        disabilities: 'no',
        chronicConditions: [],
        vaccinations: ['COVID-19', 'Hepatitis B'],
        employmentType: 'Construction Worker',
        employerName: 'ABC Construction Ltd',
        employerContact: '9876543401',
        workLocation: 'Metro Construction Site, Kochi',
        workAddress: 'Metro Rail Site, Aluva Road, Kochi',
        duration: '2 years',
        familyMembers: 4
      },
      {
        email: 'suresh.worker@gmail.com',
        firstName: 'Suresh',
        lastName: 'Patel',
        gender: 'male',
        dob: new Date('1990-01-20'),
        aadhaar: '123456789002',
        mobile: '9876543302',
        nativeState: 'Gujarat',
        address: 'Workers Colony, Technopark',
        district: 'Thiruvananthapuram',
        pincode: '695581',
        bloodGroup: 'O+',
        height: 165,
        weight: 60,
        disabilities: 'no',
        chronicConditions: ['Hypertension'],
        vaccinations: ['COVID-19', 'Tetanus'],
        employmentType: 'Factory Worker',
        employerName: 'Tech Manufacturing Co',
        employerContact: '9876543402',
        workLocation: 'Electronics Factory, Technopark',
        workAddress: 'Technopark Phase 2, Thiruvananthapuram',
        duration: '18 months',
        familyMembers: 3
      },
      {
        email: 'vijay.worker@gmail.com',
        firstName: 'Vijay',
        lastName: 'Singh',
        gender: 'male',
        dob: new Date('1987-09-05'),
        aadhaar: '123456789003',
        mobile: '9876543303',
        nativeState: 'Bihar',
        address: 'Labour Camp, Palakkad',
        district: 'Palakkad',
        pincode: '678001',
        bloodGroup: 'A+',
        height: 172,
        weight: 70,
        disabilities: 'no',
        chronicConditions: [],
        vaccinations: ['COVID-19'],
        employmentType: 'Agricultural Worker',
        employerName: 'Green Valley Farms',
        employerContact: '9876543403',
        workLocation: 'Rice Fields, Palakkad',
        workAddress: 'Kanjikode, Palakkad',
        duration: '6 months',
        familyMembers: 2
      },
      {
        email: 'ankit.worker@gmail.com',
        firstName: 'Ankit',
        lastName: 'Sharma',
        gender: 'male',
        dob: new Date('1992-11-30'),
        aadhaar: '123456789004',
        mobile: '9876543304',
        nativeState: 'Rajasthan',
        address: 'Port Worker Housing, Kochi',
        district: 'Ernakulam',
        pincode: '682015',
        bloodGroup: 'AB+',
        height: 168,
        weight: 62,
        disabilities: 'no',
        chronicConditions: ['Diabetes'],
        vaccinations: ['COVID-19', 'Hepatitis A'],
        employmentType: 'Port Worker',
        employerName: 'Kochi Port Authority',
        employerContact: '9876543404',
        workLocation: 'Kochi Port',
        workAddress: 'Willingdon Island, Kochi',
        duration: '3 years',
        familyMembers: 5
      },
      {
        email: 'deepak.worker@gmail.com',
        firstName: 'Deepak',
        lastName: 'Yadav',
        gender: 'male',
        dob: new Date('1988-04-12'),
        aadhaar: '123456789005',
        mobile: '9876543305',
        nativeState: 'Odisha',
        address: 'Industrial Area, Kollam',
        district: 'Kollam',
        pincode: '691001',
        bloodGroup: 'O-',
        height: 175,
        weight: 68,
        disabilities: 'no',
        chronicConditions: [],
        vaccinations: ['COVID-19', 'Typhoid'],
        employmentType: 'Chemical Plant Worker',
        employerName: 'Kerala Chemicals Ltd',
        employerContact: '9876543405',
        workLocation: 'Chemical Complex, Kollam',
        workAddress: 'KINFRA Park, Kollam',
        duration: '1.5 years',
        familyMembers: 1
      }
    ];

    const workers = [];
    for (const workerData of workersData) {
      // Generate health ID
      const healthId = healthCardService.generateHealthId();

      // Create user account for worker
      const workerUser = new User({
        email: workerData.email,
        password: hashedPassword,
        role: 'worker',
        userType: 'worker',
        healthId: healthId
      });
      await workerUser.save();

      // Create worker profile
      const worker = new Worker({
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
        disabilities: workerData.disabilities,
        chronicConditions: workerData.chronicConditions,
        vaccinations: workerData.vaccinations,
        employmentType: workerData.employmentType,
        employerName: workerData.employerName,
        employerContact: workerData.employerContact,
        workLocation: workerData.workLocation,
        workAddress: workerData.workAddress,
        duration: workerData.duration,
        familyMembers: workerData.familyMembers,
        healthId: healthId
      });
      await worker.save();

      // Update user with worker reference
      workerUser.worker = worker._id;
      await workerUser.save();

      workers.push(worker);
      console.log(`✅ Created worker: ${workerData.firstName} ${workerData.lastName} (Health ID: ${healthId})`);
    }

    // ===== CREATE PATIENTS =====
    console.log('👥 Creating regular patients...');
    
    const patientsData = [
      {
        email: 'sita.patient@gmail.com',
        firstName: 'Sita',
        lastName: 'Nair',
        gender: 'female',
        dob: new Date('1975-08-25'),
        aadhaar: '123456789101',
        mobile: '9876543501',
        nativeState: 'Kerala',
        address: 'TC Road, Thiruvananthapuram',
        district: 'Thiruvananthapuram',
        pincode: '695001',
        bloodGroup: 'A-',
        height: 160,
        weight: 55,
        disabilities: 'no',
        chronicConditions: ['Hypertension'],
        vaccinations: ['COVID-19', 'Flu']
      },
      {
        email: 'ravi.patient@gmail.com',
        firstName: 'Ravi',
        lastName: 'Menon',
        gender: 'male',
        dob: new Date('1965-02-14'),
        aadhaar: '123456789102',
        mobile: '9876543502',
        nativeState: 'Kerala',
        address: 'MG Road, Kochi',
        district: 'Ernakulam',
        pincode: '682035',
        bloodGroup: 'B-',
        height: 170,
        weight: 75,
        disabilities: 'no',
        chronicConditions: ['Diabetes', 'Heart Disease'],
        vaccinations: ['COVID-19', 'Pneumonia']
      },
      {
        email: 'maya.patient@gmail.com',
        firstName: 'Maya',
        lastName: 'Pillai',
        gender: 'female',
        dob: new Date('1982-12-03'),
        aadhaar: '123456789103',
        mobile: '9876543503',
        nativeState: 'Kerala',
        address: 'Beach Road, Kozhikode',
        district: 'Kozhikode',
        pincode: '673032',
        bloodGroup: 'O+',
        height: 165,
        weight: 58,
        disabilities: 'no',
        chronicConditions: [],
        vaccinations: ['COVID-19', 'HPV']
      }
    ];

    const patients = [];
    for (const patientData of patientsData) {
      // Generate health ID
      const healthId = healthCardService.generateHealthId();

      // Create user account for patient
      const patientUser = new User({
        email: patientData.email,
        password: hashedPassword,
        role: 'patient',
        userType: 'patient',
        healthId: healthId
      });
      await patientUser.save();

      // Create patient profile
      const patient = new Patient({
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
        disabilities: patientData.disabilities,
        chronicConditions: patientData.chronicConditions,
        vaccinations: patientData.vaccinations,
        healthId: healthId
      });
      await patient.save();

      // Update user with patient reference
      patientUser.patient = patient._id;
      await patientUser.save();

      patients.push(patient);
      console.log(`✅ Created patient: ${patientData.firstName} ${patientData.lastName} (Health ID: ${healthId})`);
    }

    // ===== CREATE HEALTH RECORDS =====
    console.log('📋 Creating health records...');
    
    const allPatients = [...workers, ...patients];
    
    const healthRecordsData = [
      {
        patientIndex: 0, // Ramesh Kumar (worker)
        doctorIndex: 0, // Dr. Rajesh Kumar
        diagnosis: 'Routine health checkup - Normal findings',
        treatment: 'Continue current work with safety precautions',
        symptoms: 'No symptoms reported',
        severity: 'normal',
        status: 'completed',
        prescriptions: ['Multivitamin tablets'],
        tests: ['Blood pressure', 'Blood sugar'],
        hospitalName: 'Kumar Medical Center'
      },
      {
        patientIndex: 1, // Suresh Patel (worker)
        doctorIndex: 1, // Dr. Priya Nair
        diagnosis: 'Mild hypertension detected',
        treatment: 'Blood pressure medication and lifestyle changes',
        symptoms: 'Occasional headaches, fatigue',
        severity: 'moderate',
        status: 'completed',
        prescriptions: ['Amlodipine 5mg', 'Low sodium diet'],
        tests: ['ECG', 'Blood pressure monitoring'],
        hospitalName: 'Nair Health Clinic'
      },
      {
        patientIndex: 2, // Vijay Singh (worker)
        doctorIndex: 2, // Dr. Ahmed Hassan
        diagnosis: 'Minor work-related injury - cut on hand',
        treatment: 'Wound cleaning and dressing, tetanus shot',
        symptoms: 'Cut on right hand from machinery',
        severity: 'normal',
        status: 'completed',
        prescriptions: ['Antibiotic ointment', 'Pain relievers'],
        tests: ['Wound examination'],
        hospitalName: 'Hassan Emergency Care'
      },
      {
        patientIndex: 5, // Sita Nair (patient)
        doctorIndex: 0, // Dr. Rajesh Kumar
        diagnosis: 'Hypertension management checkup',
        treatment: 'Continue medication, regular monitoring',
        symptoms: 'Well controlled blood pressure',
        severity: 'normal',
        status: 'completed',
        prescriptions: ['Lisinopril 10mg'],
        tests: ['Blood pressure', 'Lipid profile'],
        hospitalName: 'Kumar Medical Center'
      },
      {
        patientIndex: 6, // Ravi Menon (patient)
        doctorIndex: 1, // Dr. Priya Nair
        diagnosis: 'Diabetes and cardiac assessment',
        treatment: 'Insulin adjustment and cardiac medications',
        symptoms: 'Stable diabetes, mild chest discomfort',
        severity: 'moderate',
        status: 'completed',
        prescriptions: ['Insulin', 'Metoprolol', 'Aspirin'],
        tests: ['HbA1c', 'ECG', 'Echo'],
        hospitalName: 'Nair Health Clinic'
      }
    ];

    for (const recordData of healthRecordsData) {
      const patient = allPatients[recordData.patientIndex];
      const doctor = doctors[recordData.doctorIndex];
      
      const healthRecord = new HealthRecord({
        worker: patient.user ? null : patient._id, // If it's a worker
        patient: patient.user ? patient._id : null, // If it's a patient
        doctor: doctor._id,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        symptoms: recordData.symptoms,
        diagnosis: recordData.diagnosis,
        treatment: recordData.treatment,
        severity: recordData.severity,
        status: recordData.status,
        prescriptions: recordData.prescriptions,
        tests: recordData.tests,
        hospitalName: recordData.hospitalName
      });

      await healthRecord.save();
      console.log(`✅ Created health record for ${patient.firstName} ${patient.lastName}`);
    }

    // ===== CREATE APPOINTMENTS =====
    console.log('📅 Creating appointments...');
    
    const appointmentsData = [
      {
        patientIndex: 3, // Ankit Sharma (worker)
        doctorIndex: 0, // Dr. Rajesh Kumar
        type: 'Health Checkup',
        hospital: 'Kumar Medical Center',
        department: 'General Medicine',
        status: 'scheduled',
        priority: 'normal',
        notes: 'Regular diabetes follow-up',
        daysFromNow: 7
      },
      {
        patientIndex: 4, // Deepak Yadav (worker)
        doctorIndex: 2, // Dr. Ahmed Hassan
        type: 'Follow-up',
        hospital: 'Hassan Emergency Care',
        department: 'Occupational Health',
        status: 'scheduled',
        priority: 'high',
        notes: 'Chemical exposure assessment',
        daysFromNow: 3
      },
      {
        patientIndex: 7, // Maya Pillai (patient)
        doctorIndex: 1, // Dr. Priya Nair
        type: 'Vaccination',
        hospital: 'Nair Health Clinic',
        department: 'Preventive Medicine',
        status: 'scheduled',
        priority: 'normal',
        notes: 'Annual flu vaccination',
        daysFromNow: 14
      }
    ];

    for (const appointmentData of appointmentsData) {
      const patient = allPatients[appointmentData.patientIndex];
      const doctor = doctors[appointmentData.doctorIndex];
      
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + appointmentData.daysFromNow);
      
      const appointment = new Appointment({
        worker: patient.employmentType ? patient._id : null, // If it's a worker
        patient: !patient.employmentType ? patient._id : null, // If it's a patient
        doctor: doctor._id,
        date: appointmentDate,
        time: '10:00 AM',
        type: appointmentData.type,
        hospital: appointmentData.hospital,
        department: appointmentData.department,
        status: appointmentData.status,
        priority: appointmentData.priority,
        notes: appointmentData.notes,
        contact: patient.mobile,
        address: patient.address
      });

      await appointment.save();
      console.log(`✅ Created appointment for ${patient.firstName} ${patient.lastName}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👨‍⚕️ Doctors created: ${doctors.length}`);
    console.log(`👷‍♂️ Workers created: ${workers.length}`);
    console.log(`👥 Patients created: ${patients.length}`);
    console.log(`📋 Health records created: ${healthRecordsData.length}`);
    console.log(`📅 Appointments created: ${appointmentsData.length}`);
    
    console.log('\n🔐 Login credentials (password for all: password123):');
    console.log('Doctors:');
    doctorsData.forEach(doctor => {
      console.log(`  - ${doctor.email} (${doctor.firstName} ${doctor.lastName})`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Main execution
const runSeeder = async () => {
  try {
    await connectDB();
    await seedData();
    console.log('\n✅ Seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();

export default { seedData, connectDB };