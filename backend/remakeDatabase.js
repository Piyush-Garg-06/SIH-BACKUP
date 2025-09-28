import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import User from './models/User.js';
import Worker from './models/Worker.js';
import HealthRecord from './models/HealthRecord.js';
import Doctor from './models/Doctor.js';
import Hospital from './models/Hospital.js';
import Emitra from './models/Emitra.js';

// Import health card service
import healthCardService from './services/healthCardService.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SIH');
    console.log('MongoDB Connected for database remake...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Clear database function
const clearDatabase = async () => {
  console.log('🗑️  Clearing database...');
  await User.deleteMany({});
  await Worker.deleteMany({});
  await Doctor.deleteMany({});
  await Hospital.deleteMany({});
  await Emitra.deleteMany({});
  await HealthRecord.deleteMany({});
  console.log('✅ Database cleared successfully!');
};

// Create admins
const createAdmins = async (hashedPassword) => {
  console.log('🔐 Creating 3 admins...');
  
  const adminsData = [
    {
      email: 'admin1@healthcare.gov',
      password: hashedPassword,
      role: 'admin'
    },
    {
      email: 'admin2@healthcare.gov',
      password: hashedPassword,
      role: 'admin'
    },
    {
      email: 'admin3@healthcare.gov',
      password: hashedPassword,
      role: 'admin'
    }
  ];
  
  const admins = [];
  for (const adminData of adminsData) {
    const adminUser = new User(adminData);
    await adminUser.save();
    admins.push(adminUser);
    console.log(`✅ Created admin: ${adminData.email}`);
  }
  
  return admins;
};

// Create hospitals
const createHospitals = async () => {
  console.log('🏥 Creating hospitals...');
  
  const hospitalsData = [
    {
      name: 'Government Medical College Hospital',
      location: 'Thiruvananthapuram',
      address: 'Palayam, Thiruvananthapuram, Kerala 695032',
      district: 'Thiruvananthapuram',
      state: 'Kerala',
      pincode: '695032',
      contact: '0471-2528200',
      email: 'gmch.tvm@kerala.gov.in',
      type: 'Government',
      specialties: ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics']
    },
    {
      name: 'Amrita Institute of Medical Sciences',
      location: 'Kochi',
      address: 'Ponekkara, Kochi, Kerala 682041',
      district: 'Ernakulam',
      state: 'Kerala',
      pincode: '682041',
      contact: '0484-2855000',
      email: 'info@aims.amrita.edu',
      type: 'Private',
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics']
    },
    {
      name: 'KIMS Hospital',
      location: 'Kottayam',
      address: 'Anickadu, Kottayam, Kerala 686002',
      district: 'Kottayam',
      state: 'Kerala',
      pincode: '686002',
      contact: '0481-2555555',
      email: 'info@kimshospital.com',
      type: 'Private',
      specialties: ['General Medicine', 'Gynecology', 'ENT', 'Dermatology']
    },
    {
      name: 'District Hospital',
      location: 'Kozhikode',
      address: 'Mini Bypass Road, Kozhikode, Kerala 673004',
      district: 'Kozhikode',
      state: 'Kerala',
      pincode: '673004',
      contact: '0495-2375500',
      email: 'dhkozhikode@kerala.gov.in',
      type: 'Government',
      specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Emergency']
    }
  ];
  
  const hospitals = [];
  for (const hospitalData of hospitalsData) {
    const hospital = new Hospital(hospitalData);
    await hospital.save();
    hospitals.push(hospital);
    console.log(`✅ Created hospital: ${hospitalData.name}`);
  }
  
  return hospitals;
};

// Create doctors and associate with hospitals
const createDoctors = async (hashedPassword, hospitals) => {
  console.log('👨‍⚕️ Creating 4 doctors...');
  
  const doctorsData = [
    {
      email: 'dr.sunita@healthcare.gov',
      firstName: 'Sunita',
      lastName: 'Sharma',
      gender: 'female',
      dob: new Date('1980-05-10'),
      mobile: '9876543211',
      address: 'Medical Officers Colony, Thiruvananthapuram',
      district: 'Thiruvananthapuram',
      pincode: '695001',
      registrationNumber: 'DOC12345',
      specialization: 'General Physician',
      clinicName: 'City General Hospital',
      clinicAddress: 'Palayam, Thiruvananthapuram',
      hospital: hospitals[0]._id // Government Medical College Hospital
    },
    {
      email: 'dr.ramesh@healthcare.gov',
      firstName: 'Ramesh',
      lastName: 'Pillai',
      gender: 'male',
      dob: new Date('1975-08-15'),
      mobile: '9876543212',
      address: 'Doctors Quarters, Kochi',
      district: 'Ernakulam',
      pincode: '682001',
      registrationNumber: 'DOC67890',
      specialization: 'Cardiology',
      clinicName: 'Heart Care Clinic',
      clinicAddress: 'MG Road, Kochi',
      hospital: hospitals[1]._id // Amrita Institute of Medical Sciences
    },
    {
      email: 'dr.anitha@healthcare.gov',
      firstName: 'Anitha',
      lastName: 'Nair',
      gender: 'female',
      dob: new Date('1982-12-03'),
      mobile: '9876543213',
      address: 'Medical Colony, Kottayam',
      district: 'Kottayam',
      pincode: '686001',
      registrationNumber: 'DOC11223',
      specialization: 'Pediatrics',
      clinicName: 'Children Care Center',
      clinicAddress: 'SH College Road, Kottayam',
      hospital: hospitals[2]._id // KIMS Hospital
    },
    {
      email: 'dr.vijay@healthcare.gov',
      firstName: 'Vijay',
      lastName: 'Kumar',
      gender: 'male',
      dob: new Date('1978-03-22'),
      mobile: '9876543214',
      address: 'Doctors Quarters, Kozhikode',
      district: 'Kozhikode',
      pincode: '673001',
      registrationNumber: 'DOC44556',
      specialization: 'Orthopedics',
      clinicName: 'Bone & Joint Clinic',
      clinicAddress: 'Mini Bypass Road, Kozhikode',
      hospital: hospitals[3]._id // District Hospital
    }
  ];
  
  const doctors = [];
  for (const doctorData of doctorsData) {
    const doctorUser = new User({
      email: doctorData.email,
      password: hashedPassword,
      role: 'doctor'
    });
    await doctorUser.save();
    
    const doctor = new Doctor({
      user: doctorUser._id, // Add the user reference
      ...doctorData
    });
    await doctor.save();
    
    // Update user with doctor reference
    doctorUser.doctor = doctor._id;
    await doctorUser.save();
    
    doctors.push(doctor);
    console.log(`✅ Created doctor: Dr. ${doctorData.firstName} ${doctorData.lastName}`);
  }
  
  return doctors;
};

// Create emitras
const createEmitras = async (hashedPassword) => {
  console.log('🏢 Creating 3 emitras...');
  
  const emitrasData = [
    {
      email: 'emitra1@kerala.gov',
      operatorId: 'EM-001',
      fullName: 'Rajesh Kumar',
      centerName: 'eMitra Center Thiruvananthapuram',
      centerLocation: 'Statue, Thiruvananthapuram, Kerala',
      mobile: '9876543214'
    },
    {
      email: 'emitra2@kerala.gov',
      operatorId: 'EM-002',
      fullName: 'Sunita Sharma',
      centerName: 'eMitra Center Kochi',
      centerLocation: 'MG Road, Kochi, Kerala',
      mobile: '9876543215'
    },
    {
      email: 'emitra3@kerala.gov',
      operatorId: 'EM-003',
      fullName: 'Anil Verma',
      centerName: 'eMitra Center Kozhikode',
      centerLocation: 'Mini Bypass Road, Kozhikode, Kerala',
      mobile: '9876543216'
    }
  ];
  
  const emitras = [];
  for (const emitraData of emitrasData) {
    const emitraUser = new User({
      email: emitraData.email,
      password: hashedPassword,
      role: 'emitra'
    });
    await emitraUser.save();
    
    const emitra = new Emitra({
      user: emitraUser._id,
      ...emitraData
    });
    await emitra.save();
    
    // Update user with emitra reference
    emitraUser.emitra = emitra._id;
    await emitraUser.save();
    
    emitras.push(emitra);
    console.log(`✅ Created emitra: ${emitraData.fullName}`);
  }
  
  return emitras;
};

// Create workers distributed among doctors
const createWorkers = async (hashedPassword, doctors) => {
  console.log('👷 Creating 20 workers distributed among doctors...');
  
  const workersData = [
    // Workers for Dr. Sunita Sharma (General Physician)
    {
      email: 'rajesh.kumar@worker.com',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      gender: 'male',
      dob: new Date('1985-03-12'),
      aadhaar: '111122223333',
      mobile: '9876543001',
      nativeState: 'Bihar',
      address: 'Worker Colony, Thiruvananthapuram',
      district: 'Thiruvananthapuram',
      pincode: '695001',
      bloodGroup: 'O+',
      height: 170,
      weight: 65,
      employmentType: 'Construction',
      employerName: 'Kerala Constructions Ltd',
      workLocation: 'Construction Site, TVM',
      assignedDoctor: 0 // Index of doctor in doctors array
    },
    {
      email: 'suresh.patel@worker.com',
      firstName: 'Suresh',
      lastName: 'Patel',
      gender: 'male',
      dob: new Date('1990-07-08'),
      aadhaar: '111122223334',
      mobile: '9876543002',
      nativeState: 'Gujarat',
      address: 'Migrant Quarters, Kochi',
      district: 'Ernakulam',
      pincode: '682001',
      bloodGroup: 'B+',
      height: 168,
      weight: 62,
      employmentType: 'Warehouse',
      employerName: 'Kerala Logistics',
      workLocation: 'Warehouse, Kochi',
      assignedDoctor: 0
    },
    {
      email: 'ramesh.yadav@worker.com',
      firstName: 'Ramesh',
      lastName: 'Yadav',
      gender: 'male',
      dob: new Date('1988-11-22'),
      aadhaar: '111122223335',
      mobile: '9876543003',
      nativeState: 'Uttar Pradesh',
      address: 'Labor Camp, Kozhikode',
      district: 'Kozhikode',
      pincode: '673001',
      bloodGroup: 'A+',
      height: 172,
      weight: 68,
      employmentType: 'Factory Worker',
      employerName: 'Kerala Electronics',
      workLocation: 'Factory, Kozhikode',
      assignedDoctor: 0
    },
    {
      email: 'mohan.singh@worker.com',
      firstName: 'Mohan',
      lastName: 'Singh',
      gender: 'male',
      dob: new Date('1992-04-15'),
      aadhaar: '111122223336',
      mobile: '9876543004',
      nativeState: 'Punjab',
      address: 'Hostel, Thrissur',
      district: 'Thrissur',
      pincode: '680001',
      bloodGroup: 'AB+',
      height: 175,
      weight: 70,
      employmentType: 'Driver',
      employerName: 'Kerala Transport',
      workLocation: 'Transport Depot, Thrissur',
      assignedDoctor: 0
    },
    {
      email: 'vikash.gupta@worker.com',
      firstName: 'Vikash',
      lastName: 'Gupta',
      gender: 'male',
      dob: new Date('1987-06-30'),
      aadhaar: '111122223337',
      mobile: '9876543005',
      nativeState: 'Haryana',
      address: 'Quarters, Kollam',
      district: 'Kollam',
      pincode: '691001',
      bloodGroup: 'O-',
      height: 169,
      weight: 64,
      employmentType: 'Security Guard',
      employerName: 'Elite Security',
      workLocation: 'Office Complex, Kollam',
      assignedDoctor: 0
    },
    
    // Workers for Dr. Ramesh Pillai (Cardiology)
    {
      email: 'arun.das@worker.com',
      firstName: 'Arun',
      lastName: 'Das',
      gender: 'male',
      dob: new Date('1984-12-01'),
      aadhaar: '111122223338',
      mobile: '9876543006',
      nativeState: 'West Bengal',
      address: 'Colony, Alappuzha',
      district: 'Alappuzha',
      pincode: '688001',
      bloodGroup: 'B-',
      height: 171,
      weight: 75,
      employmentType: 'Fisherman',
      employerName: 'Coastal Fisheries',
      workLocation: 'Fishing Harbor, Alappuzha',
      assignedDoctor: 1
    },
    {
      email: 'deepak.jha@worker.com',
      firstName: 'Deepak',
      lastName: 'Jha',
      gender: 'male',
      dob: new Date('1989-05-14'),
      aadhaar: '111122223339',
      mobile: '9876543007',
      nativeState: 'Bihar',
      address: 'Camp, Kannur',
      district: 'Kannur',
      pincode: '670001',
      bloodGroup: 'A-',
      height: 167,
      weight: 80,
      employmentType: 'Construction',
      employerName: 'Northern Constructions',
      workLocation: 'Building Site, Kannur',
      assignedDoctor: 1
    },
    {
      email: 'akash.sharma@worker.com',
      firstName: 'Akash',
      lastName: 'Sharma',
      gender: 'male',
      dob: new Date('1986-09-18'),
      aadhaar: '111122223340',
      mobile: '9876543008',
      nativeState: 'Madhya Pradesh',
      address: 'Quarters, Palakkad',
      district: 'Palakkad',
      pincode: '678001',
      bloodGroup: 'AB-',
      height: 173,
      weight: 78,
      employmentType: 'Factory Worker',
      employerName: 'Southern Industries',
      workLocation: 'Factory, Palakkad',
      assignedDoctor: 1
    },
    {
      email: 'vijay.kumar@worker.com',
      firstName: 'Vijay',
      lastName: 'Kumar',
      gender: 'male',
      dob: new Date('1991-02-25'),
      aadhaar: '111122223341',
      mobile: '9876543009',
      nativeState: 'Tamil Nadu',
      address: 'Hostel, Kottayam',
      district: 'Kottayam',
      pincode: '686001',
      bloodGroup: 'O+',
      height: 166,
      weight: 72,
      employmentType: 'Driver',
      employerName: 'Kerala Travels',
      workLocation: 'Bus Depot, Kottayam',
      assignedDoctor: 1
    },
    {
      email: 'anil.verma@worker.com',
      firstName: 'Anil',
      lastName: 'Verma',
      gender: 'male',
      dob: new Date('1983-08-07'),
      aadhaar: '111122223342',
      mobile: '9876543010',
      nativeState: 'Rajasthan',
      address: 'Camp, Wayanad',
      district: 'Wayanad',
      pincode: '673121',
      bloodGroup: 'B+',
      height: 174,
      weight: 76,
      employmentType: 'Agriculture',
      employerName: 'Hill Farms',
      workLocation: 'Tea Plantation, Wayanad',
      assignedDoctor: 1
    },
    
    // Workers for Dr. Anitha Nair (Pediatrics)
    {
      email: 'raj.mehta@worker.com',
      firstName: 'Raj',
      lastName: 'Mehta',
      gender: 'male',
      dob: new Date('1980-01-20'),
      aadhaar: '111122223343',
      mobile: '9876543011',
      nativeState: 'Delhi',
      address: 'Hospital Area, Ernakulam',
      district: 'Ernakulam',
      pincode: '682002',
      bloodGroup: 'A+',
      height: 170,
      weight: 85,
      employmentType: 'Former Worker',
      employerName: 'None (Hospitalized)',
      workLocation: 'Medical Care',
      assignedDoctor: 2
    },
    {
      email: 'kishore.nair@worker.com',
      firstName: 'Kishore',
      lastName: 'Nair',
      gender: 'male',
      dob: new Date('1978-04-12'),
      aadhaar: '111122223344',
      mobile: '9876543012',
      nativeState: 'Kerala',
      address: 'Medical Facility, Thiruvananthapuram',
      district: 'Thiruvananthapuram',
      pincode: '695002',
      bloodGroup: 'AB+',
      height: 165,
      weight: 70,
      employmentType: 'Former Worker',
      employerName: 'None (Hospitalized)',
      workLocation: 'Intensive Care',
      assignedDoctor: 2
    },
    {
      email: 'prakash.reddy@worker.com',
      firstName: 'Prakash',
      lastName: 'Reddy',
      gender: 'male',
      dob: new Date('1982-07-28'),
      aadhaar: '111122223345',
      mobile: '9876543013',
      nativeState: 'Andhra Pradesh',
      address: 'Quarantine Center, Kozhikode',
      district: 'Kozhikode',
      pincode: '673002',
      bloodGroup: 'O-',
      height: 168,
      weight: 60,
      employmentType: 'Former Worker',
      employerName: 'None (Quarantined)',
      workLocation: 'Medical Isolation',
      assignedDoctor: 2
    },
    {
      email: 'santosh.pandey@worker.com',
      firstName: 'Santosh',
      lastName: 'Pandey',
      gender: 'male',
      dob: new Date('1975-10-05'),
      aadhaar: '111122223346',
      mobile: '9876543014',
      nativeState: 'Chhattisgarh',
      address: 'Special Care Unit, Thrissur',
      district: 'Thrissur',
      pincode: '680002',
      bloodGroup: 'B-',
      height: 172,
      weight: 90,
      employmentType: 'Former Worker',
      employerName: 'None (Critical Care)',
      workLocation: 'Critical Care Unit',
      assignedDoctor: 2
    },
    {
      email: 'manoj.choudhary@worker.com',
      firstName: 'Manoj',
      lastName: 'Choudhary',
      gender: 'male',
      dob: new Date('1981-12-19'),
      aadhaar: '111122223347',
      mobile: '9876543015',
      nativeState: 'Odisha',
      address: 'Emergency Ward, Kollam',
      district: 'Kollam',
      pincode: '691002',
      bloodGroup: 'A-',
      height: 169,
      weight: 65,
      employmentType: 'Former Worker',
      employerName: 'None (Emergency Care)',
      workLocation: 'Emergency Department',
      assignedDoctor: 2
    },
    
    // Workers for Dr. Vijay Kumar (Orthopedics)
    {
      email: 'hari.krishnan@worker.com',
      firstName: 'Hari',
      lastName: 'Krishnan',
      gender: 'male',
      dob: new Date('1993-03-08'),
      aadhaar: '111122223348',
      mobile: '9876543016',
      nativeState: 'Kerala',
      address: 'Colony, Kasaragod',
      district: 'Kasaragod',
      pincode: '671121',
      bloodGroup: 'O+',
      height: 171,
      weight: 67,
      employmentType: 'Construction',
      employerName: 'Eastern Constructions',
      workLocation: 'Building Site, Kasaragod',
      assignedDoctor: 3
    },
    {
      email: 'gopal.nair@worker.com',
      firstName: 'Gopal',
      lastName: 'Nair',
      gender: 'male',
      dob: new Date('1988-06-14'),
      aadhaar: '111122223349',
      mobile: '9876543017',
      nativeState: 'Kerala',
      address: 'Quarters, Pathanamthitta',
      district: 'Pathanamthitta',
      pincode: '689645',
      bloodGroup: 'B+',
      height: 173,
      weight: 74,
      employmentType: 'Agriculture',
      employerName: 'Spice Farms',
      workLocation: 'Plantation, Pathanamthitta',
      assignedDoctor: 3
    },
    {
      email: 'ravi.menon@worker.com',
      firstName: 'Ravi',
      lastName: 'Menon',
      gender: 'male',
      dob: new Date('1990-09-22'),
      aadhaar: '111122223350',
      mobile: '9876543018',
      nativeState: 'Kerala',
      address: 'Hostel, Idukki',
      district: 'Idukki',
      pincode: '685601',
      bloodGroup: 'AB+',
      height: 175,
      weight: 71,
      employmentType: 'Tourism',
      employerName: 'Hill Resorts',
      workLocation: 'Resort, Idukki',
      assignedDoctor: 3
    },
    {
      email: 'vishnu.pillai@worker.com',
      firstName: 'Vishnu',
      lastName: 'Pillai',
      gender: 'male',
      dob: new Date('1985-12-30'),
      aadhaar: '111122223351',
      mobile: '9876543019',
      nativeState: 'Kerala',
      address: 'Camp, Malappuram',
      district: 'Malappuram',
      pincode: '676505',
      bloodGroup: 'O-',
      height: 167,
      weight: 69,
      employmentType: 'Textile',
      employerName: 'Kerala Textiles',
      workLocation: 'Factory, Malappuram',
      assignedDoctor: 3
    },
    {
      email: 'sreekumar.varma@worker.com',
      firstName: 'Sreekumar',
      lastName: 'Varma',
      gender: 'male',
      dob: new Date('1991-02-14'),
      aadhaar: '111122223352',
      mobile: '9876543020',
      nativeState: 'Kerala',
      address: 'Quarters, Kannur',
      district: 'Kannur',
      pincode: '670002',
      bloodGroup: 'A+',
      height: 170,
      weight: 66,
      employmentType: 'Fishing',
      employerName: 'Seafood Exports',
      workLocation: 'Fishing Harbor, Kannur',
      assignedDoctor: 3
    }
  ];
  
  const workers = [];
  for (const workerData of workersData) {
    const healthId = healthCardService.generateHealthId();
    
    const workerUser = new User({
      email: workerData.email,
      password: hashedPassword,
      role: 'worker'
    });
    await workerUser.save();
    
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
      employmentType: workerData.employmentType,
      employerName: workerData.employerName,
      workLocation: workerData.workLocation,
      healthId: healthId,
      doctors: [doctors[workerData.assignedDoctor]._id] // Assign to specific doctor
    });
    await worker.save();
    
    // Update user with worker reference
    workerUser.worker = worker._id;
    await workerUser.save();
    
    workers.push(worker);
    console.log(`✅ Created worker: ${workerData.firstName} ${workerData.lastName} (Doctor: ${doctors[workerData.assignedDoctor].firstName} ${doctors[workerData.assignedDoctor].lastName})`);
  }
  
  return workers;
};

// Create health records for workers with severity and disease classifications
const createHealthRecords = async (workers, doctors) => {
  console.log('📝 Creating health records for workers with severity and disease classifications...');
  
  // Health record data with severity and disease classifications
  const healthRecordsData = [
    // Normal severity records
    {
      workerIndex: 0, // Rajesh Kumar
      doctorIndex: 0, // Dr. Sunita Sharma
      diagnosis: 'Common Cold',
      symptoms: 'Mild cough, runny nose',
      treatment: 'Rest and fluids',
      severity: 'normal',
      diseaseType: 'non infectious'
    },
    {
      workerIndex: 1, // Suresh Patel
      doctorIndex: 0, // Dr. Sunita Sharma
      diagnosis: 'Minor Skin Rash',
      symptoms: 'Mild skin irritation',
      treatment: 'Topical cream',
      severity: 'normal',
      diseaseType: 'non infectious'
    },
    {
      workerIndex: 2, // Ramesh Yadav
      doctorIndex: 0, // Dr. Sunita Sharma
      diagnosis: 'Seasonal Allergies',
      symptoms: 'Sneezing, itchy eyes',
      treatment: 'Antihistamines',
      severity: 'normal',
      diseaseType: 'non infectious'
    },
    {
      workerIndex: 3, // Mohan Singh
      doctorIndex: 0, // Dr. Sunita Sharma
      diagnosis: 'Minor Back Pain',
      symptoms: 'Mild back discomfort',
      treatment: 'Pain relief medication',
      severity: 'normal',
      diseaseType: 'non infectious'
    },
    {
      workerIndex: 4, // Vikash Gupta
      doctorIndex: 0, // Dr. Sunita Sharma
      diagnosis: 'Mild Fatigue',
      symptoms: 'Tiredness',
      treatment: 'Adequate rest',
      severity: 'normal',
      diseaseType: 'non infectious'
    },
    
    // Moderate severity records
    {
      workerIndex: 5, // Arun Das
      doctorIndex: 1, // Dr. Ramesh Pillai
      diagnosis: 'Hypertension',
      symptoms: 'High blood pressure',
      treatment: 'Blood pressure medication',
      severity: 'moderate',
      diseaseType: 'non communicable'
    },
    {
      workerIndex: 6, // Deepak Jha
      doctorIndex: 1, // Dr. Ramesh Pillai
      diagnosis: 'Type 2 Diabetes',
      symptoms: 'Frequent urination, fatigue',
      treatment: 'Insulin and diet control',
      severity: 'moderate',
      diseaseType: 'non communicable'
    },
    {
      workerIndex: 7, // Akash Sharma
      doctorIndex: 1, // Dr. Ramesh Pillai
      diagnosis: 'Asthma',
      symptoms: 'Wheezing, shortness of breath',
      treatment: 'Inhaler and avoid triggers',
      severity: 'moderate',
      diseaseType: 'non communicable'
    },
    {
      workerIndex: 8, // Vijay Kumar
      doctorIndex: 1, // Dr. Ramesh Pillai
      diagnosis: 'Gastritis',
      symptoms: 'Stomach pain, nausea',
      treatment: 'Antacids and dietary changes',
      severity: 'moderate',
      diseaseType: 'non infectious'
    },
    {
      workerIndex: 9, // Anil Verma
      doctorIndex: 1, // Dr. Ramesh Pillai
      diagnosis: 'Dermatitis',
      symptoms: 'Skin inflammation',
      treatment: 'Topical steroids',
      severity: 'moderate',
      diseaseType: 'non infectious'
    },
    
    // Critical severity records
    {
      workerIndex: 10, // Raj Mehta
      doctorIndex: 2, // Dr. Anitha Nair
      diagnosis: 'Severe Cardiac Arrest',
      symptoms: 'Chest pain, shortness of breath',
      treatment: 'Emergency surgery and intensive care',
      severity: 'critical',
      diseaseType: 'communicable'
    },
    {
      workerIndex: 11, // Kishore Nair
      doctorIndex: 2, // Dr. Anitha Nair
      diagnosis: 'Tuberculosis',
      symptoms: 'Persistent cough, fever, weight loss',
      treatment: 'Antibiotics for 6 months',
      severity: 'critical',
      diseaseType: 'infectious'
    },
    {
      workerIndex: 12, // Prakash Reddy
      doctorIndex: 2, // Dr. Anitha Nair
      diagnosis: 'Severe Pneumonia',
      symptoms: 'High fever, difficulty breathing',
      treatment: 'Antibiotics and oxygen therapy',
      severity: 'critical',
      diseaseType: 'infectious'
    },
    {
      workerIndex: 13, // Santosh Pandey
      doctorIndex: 2, // Dr. Anitha Nair
      diagnosis: 'Diabetic Coma',
      symptoms: 'Unconsciousness, high blood sugar',
      treatment: 'Insulin therapy and monitoring',
      severity: 'critical',
      diseaseType: 'non communicable'
    },
    {
      workerIndex: 14, // Manoj Choudhary
      doctorIndex: 2, // Dr. Anitha Nair
      diagnosis: 'Severe Malaria',
      symptoms: 'High fever, chills, body aches',
      treatment: 'Antimalarial drugs and IV fluids',
      severity: 'critical',
      diseaseType: 'infectious'
    },
    
    // Additional records with various conditions
    {
      workerIndex: 15, // Hari Krishnan
      doctorIndex: 3, // Dr. Vijay Kumar
      diagnosis: 'Hypertension',
      symptoms: 'High blood pressure',
      treatment: 'Blood pressure medication',
      severity: 'moderate',
      diseaseType: 'non communicable'
    },
    {
      workerIndex: 16, // Gopal Nair
      doctorIndex: 3, // Dr. Vijay Kumar
      diagnosis: 'Skin Infection',
      symptoms: 'Red, swollen skin',
      treatment: 'Antibiotics',
      severity: 'normal',
      diseaseType: 'infectious'
    },
    {
      workerIndex: 17, // Ravi Menon
      doctorIndex: 3, // Dr. Vijay Kumar
      diagnosis: 'Food Poisoning',
      symptoms: 'Nausea, vomiting, diarrhea',
      treatment: 'Hydration and rest',
      severity: 'moderate',
      diseaseType: 'infectious'
    },
    {
      workerIndex: 18, // Vishnu Pillai
      doctorIndex: 3, // Dr. Vijay Kumar
      diagnosis: 'Workplace Injury',
      symptoms: 'Cuts and bruises',
      treatment: 'Wound care and physiotherapy',
      severity: 'normal',
      diseaseType: 'non infectious'
    },
    {
      workerIndex: 19, // Sreekumar Varma
      doctorIndex: 3, // Dr. Vijay Kumar
      diagnosis: 'Respiratory Infection',
      symptoms: 'Cough, difficulty breathing',
      treatment: 'Antibiotics and rest',
      severity: 'moderate',
      diseaseType: 'infectious'
    }
  ];
  
  const healthRecords = [];
  for (const recordData of healthRecordsData) {
    const healthRecord = new HealthRecord({
      worker: workers[recordData.workerIndex]._id,
      doctor: doctors[recordData.doctorIndex]._id,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
      symptoms: recordData.symptoms,
      diagnosis: recordData.diagnosis,
      treatment: recordData.treatment,
      severity: recordData.severity,
      status: 'completed',
      hospitalName: doctors[recordData.doctorIndex].clinicName || 'Health Center'
    });
    
    await healthRecord.save();
    healthRecords.push(healthRecord);
    console.log(`✅ Created health record for ${workers[recordData.workerIndex].firstName} ${workers[recordData.workerIndex].lastName}`);
  }
  
  return healthRecords;
};

// Update hospitals with doctor references
const updateHospitalsWithDoctors = async (hospitals, doctors) => {
  console.log('🏥 Updating hospitals with doctor references...');
  
  // Map doctors to their respective hospitals
  const hospitalDoctorMap = {};
  
  for (const doctor of doctors) {
    const hospitalId = doctor.hospital.toString();
    if (!hospitalDoctorMap[hospitalId]) {
      hospitalDoctorMap[hospitalId] = [];
    }
    hospitalDoctorMap[hospitalId].push(doctor._id);
  }
  
  // Update each hospital with its doctors
  for (const hospital of hospitals) {
    hospital.doctors = hospitalDoctorMap[hospital._id.toString()] || [];
    await hospital.save();
    console.log(`✅ Updated ${hospital.name} with ${hospital.doctors.length} doctors`);
  }
};

// Main function to remake the database
const remakeDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create admins
    const admins = await createAdmins(hashedPassword);
    
    // Create hospitals
    const hospitals = await createHospitals();
    
    // Create doctors
    const doctors = await createDoctors(hashedPassword, hospitals);
    
    // Create emitras
    const emitras = await createEmitras(hashedPassword);
    
    // Create workers
    const workers = await createWorkers(hashedPassword, doctors);
    
    // Create health records
    const healthRecords = await createHealthRecords(workers, doctors);
    
    // Update hospitals with doctor references
    await updateHospitalsWithDoctors(hospitals, doctors);
    
    // Print summary
    console.log('\n🎉 Database remake completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👨‍⚕️  Doctors: ${doctors.length}`);
    console.log(`   🏢 Hospitals: ${hospitals.length}`);
    console.log(`   👷 Workers: ${workers.length}`);
    console.log(`   📝 Health Records: ${healthRecords.length}`);
    console.log(`   🔐 Admins: ${admins.length}`);
    console.log(`   🏢 Emitras: ${emitras.length}`);
    
    // Show severity distribution
    const severityCounts = {
      normal: 0,
      moderate: 0,
      critical: 0
    };
    
    for (const record of healthRecords) {
      severityCounts[record.severity]++;
    }
    
    console.log('\n📈 Severity Distribution:');
    console.log(`   Normal: ${severityCounts.normal} records`);
    console.log(`   Moderate: ${severityCounts.moderate} records`);
    console.log(`   Critical: ${severityCounts.critical} records`);
    
    // Show doctor-patient distribution
    console.log('\n👨‍⚕️‍⚕️ Doctor-Patient Distribution:');
    for (let i = 0; i < doctors.length; i++) {
      const doctorWorkers = workers.filter(worker => 
        worker.doctors && worker.doctors.some(docId => docId.toString() === doctors[i]._id.toString())
      );
      console.log(`   Dr. ${doctors[i].firstName} ${doctors[i].lastName}: ${doctorWorkers.length} patients`);
    }
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Password for all users: password123');
    console.log('\n   Admins:');
    admins.forEach((admin, index) => console.log(`     ${index + 1}. ${admin.email}`));
    console.log('\n   Doctors:');
    doctors.forEach((doctor, index) => console.log(`     ${index + 1}. ${doctor.email} (Dr. ${doctor.firstName} ${doctor.lastName})`));
    console.log('\n   Emitras:');
    emitras.forEach((emitra, index) => console.log(`     ${index + 1}. ${emitra.email} (${emitra.fullName})`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error remaking database:', error);
    process.exit(1);
  }
};

// Run the database remake
remakeDatabase();