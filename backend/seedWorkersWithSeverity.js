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

// Import health card service
import healthCardService from './services/healthCardService.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SIH');
    console.log('MongoDB Connected for worker seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Add 20 workers with severity and disease classifications
const addWorkersWithSeverity = async () => {
  try {
    console.log('🌱 Adding 20 workers with severity and disease classifications...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Get existing doctors for health records
    const doctors = await Doctor.find();
    if (doctors.length === 0) {
      console.log('⚠️  No doctors found in database. Please seed doctors first.');
      return;
    }
    
    // Select a doctor for all health records
    const doctor = doctors[0];

    // ===== CREATE 20 WORKERS WITH VARIOUS SEVERITIES AND DISEASES =====
    console.log('👷‍♂️ Creating 20 migrant workers with health records...');
    
    const workersData = [
      // Low severity workers
      {
        email: 'rajesh.low@gmail.com',
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
        healthRecord: {
          diagnosis: 'Common Cold',
          treatment: 'Rest and fluids',
          symptoms: 'Mild cough, runny nose',
          severity: 'normal', // low
          diseaseType: 'non infectious'
        }
      },
      {
        email: 'suresh.low@gmail.com',
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
        healthRecord: {
          diagnosis: 'Minor Skin Rash',
          treatment: 'Topical cream',
          symptoms: 'Mild skin irritation',
          severity: 'normal', // low
          diseaseType: 'non infectious'
        }
      },
      {
        email: 'ramesh.low@gmail.com',
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
        healthRecord: {
          diagnosis: 'Seasonal Allergies',
          treatment: 'Antihistamines',
          symptoms: 'Sneezing, itchy eyes',
          severity: 'normal', // low
          diseaseType: 'non infectious'
        }
      },
      {
        email: 'mohan.low@gmail.com',
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
        healthRecord: {
          diagnosis: 'Minor Back Pain',
          treatment: 'Pain relief medication',
          symptoms: 'Mild back discomfort',
          severity: 'normal', // low
          diseaseType: 'non infectious'
        }
      },
      {
        email: 'vikash.low@gmail.com',
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
        healthRecord: {
          diagnosis: 'Mild Fatigue',
          treatment: 'Adequate rest',
          symptoms: 'Tiredness',
          severity: 'normal', // low
          diseaseType: 'non infectious'
        }
      },
      
      // Moderate severity workers
      {
        email: 'arun.moderate@gmail.com',
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
        healthRecord: {
          diagnosis: 'Hypertension',
          treatment: 'Blood pressure medication',
          symptoms: 'High blood pressure',
          severity: 'moderate',
          diseaseType: 'non communicable'
        }
      },
      {
        email: 'deepak.moderate@gmail.com',
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
        healthRecord: {
          diagnosis: 'Type 2 Diabetes',
          treatment: 'Insulin and diet control',
          symptoms: 'Frequent urination, fatigue',
          severity: 'moderate',
          diseaseType: 'non communicable'
        }
      },
      {
        email: 'akash.moderate@gmail.com',
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
        healthRecord: {
          diagnosis: 'Asthma',
          treatment: 'Inhaler and avoid triggers',
          symptoms: 'Wheezing, shortness of breath',
          severity: 'moderate',
          diseaseType: 'non communicable'
        }
      },
      {
        email: 'vijay.moderate@gmail.com',
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
        healthRecord: {
          diagnosis: 'Gastritis',
          treatment: 'Antacids and dietary changes',
          symptoms: 'Stomach pain, nausea',
          severity: 'moderate',
          diseaseType: 'non infectious'
        }
      },
      {
        email: 'anil.moderate@gmail.com',
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
        healthRecord: {
          diagnosis: 'Dermatitis',
          treatment: 'Topical steroids',
          symptoms: 'Skin inflammation',
          severity: 'moderate',
          diseaseType: 'non infectious'
        }
      },
      
      // Critical severity workers
      {
        email: 'raj.critical@gmail.com',
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
        healthRecord: {
          diagnosis: 'Severe Cardiac Arrest',
          treatment: 'Emergency surgery and intensive care',
          symptoms: 'Chest pain, shortness of breath',
          severity: 'critical',
          diseaseType: 'communicable'
        }
      },
      {
        email: 'kishore.critical@gmail.com',
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
        healthRecord: {
          diagnosis: 'Tuberculosis',
          treatment: 'Antibiotics for 6 months',
          symptoms: 'Persistent cough, fever, weight loss',
          severity: 'critical',
          diseaseType: 'infectious'
        }
      },
      {
        email: 'prakash.critical@gmail.com',
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
        healthRecord: {
          diagnosis: 'Severe Pneumonia',
          treatment: 'Antibiotics and oxygen therapy',
          symptoms: 'High fever, difficulty breathing',
          severity: 'critical',
          diseaseType: 'infectious'
        }
      },
      {
        email: 'santosh.critical@gmail.com',
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
        healthRecord: {
          diagnosis: 'Diabetic Coma',
          treatment: 'Insulin therapy and monitoring',
          symptoms: 'Unconsciousness, high blood sugar',
          severity: 'critical',
          diseaseType: 'non communicable'
        }
      },
      {
        email: 'manoj.critical@gmail.com',
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
        healthRecord: {
          diagnosis: 'Severe Malaria',
          treatment: 'Antimalarial drugs and IV fluids',
          symptoms: 'High fever, chills, body aches',
          severity: 'critical',
          diseaseType: 'infectious'
        }
      },
      
      // Additional workers with various conditions
      {
        email: 'hari.additional@gmail.com',
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
        healthRecord: {
          diagnosis: 'Hypertension',
          treatment: 'Blood pressure medication',
          symptoms: 'High blood pressure',
          severity: 'moderate',
          diseaseType: 'non communicable'
        }
      },
      {
        email: 'gopal.additional@gmail.com',
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
        healthRecord: {
          diagnosis: 'Skin Infection',
          treatment: 'Antibiotics',
          symptoms: 'Red, swollen skin',
          severity: 'normal', // low
          diseaseType: 'infectious'
        }
      },
      {
        email: 'ravi.additional@gmail.com',
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
        healthRecord: {
          diagnosis: 'Food Poisoning',
          treatment: 'Hydration and rest',
          symptoms: 'Nausea, vomiting, diarrhea',
          severity: 'moderate',
          diseaseType: 'infectious'
        }
      },
      {
        email: 'vishnu.additional@gmail.com',
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
        healthRecord: {
          diagnosis: 'Workplace Injury',
          treatment: 'Wound care and physiotherapy',
          symptoms: 'Cuts and bruises',
          severity: 'normal', // low
          diseaseType: 'non infectious'
        }
      },
      {
        email: 'sreekumar.additional@gmail.com',
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
        healthRecord: {
          diagnosis: 'Respiratory Infection',
          treatment: 'Antibiotics and rest',
          symptoms: 'Cough, difficulty breathing',
          severity: 'moderate',
          diseaseType: 'infectious'
        }
      }
    ];

    const workers = [];
    for (const workerData of workersData) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: workerData.email });
      if (existingUser) {
        console.log(`⚠️  User ${workerData.email} already exists, skipping...`);
        continue;
      }

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
        healthId: healthId
      });
      await worker.save();

      // Update user with worker reference
      workerUser.worker = worker._id;
      await workerUser.save();

      workers.push(worker);
      console.log(`✅ Created worker: ${workerData.firstName} ${workerData.lastName}`);

      // Create health record for the worker
      const healthRecord = new HealthRecord({
        worker: worker._id,
        doctor: doctor._id,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        symptoms: workerData.healthRecord.symptoms,
        diagnosis: workerData.healthRecord.diagnosis,
        treatment: workerData.healthRecord.treatment,
        severity: workerData.healthRecord.severity,
        status: 'completed',
        hospitalName: doctor.clinicName || 'Health Center'
      });

      await healthRecord.save();
      console.log(`✅ Created health record for ${workerData.firstName} ${workerData.lastName}`);
    }

    console.log('\n🎉 Worker seeding completed successfully!');
    console.log(`📊 Total workers created: ${workers.length}`);
    
    // Show summary by severity
    const severityCounts = {
      normal: 0, // low
      moderate: 0,
      critical: 0
    };
    
    const diseaseCounts = {
      'non infectious': 0,
      'infectious': 0,
      'non communicable': 0,
      'communicable': 0
    };
    
    for (const workerData of workersData) {
      if (workerData.healthRecord.severity === 'normal') {
        severityCounts.normal++;
      } else {
        severityCounts[workerData.healthRecord.severity]++;
      }
      
      diseaseCounts[workerData.healthRecord.diseaseType]++;
    }
    
    console.log('\n📈 Severity Distribution:');
    console.log(`Low (normal): ${severityCounts.normal} workers`);
    console.log(`Moderate: ${severityCounts.moderate} workers`);
    console.log(`Critical: ${severityCounts.critical} workers`);
    
    console.log('\n🦠 Disease Type Distribution:');
    console.log(`Non Infectious: ${diseaseCounts['non infectious']} workers`);
    console.log(`Infectious: ${diseaseCounts['infectious']} workers`);
    console.log(`Non Communicable: ${diseaseCounts['non communicable']} workers`);
    console.log(`Communicable: ${diseaseCounts['communicable']} workers`);

  } catch (error) {
    console.error('❌ Error creating workers with severity:', error);
    throw error;
  }
};

// Main execution
const runWorkerSeeding = async () => {
  try {
    await connectDB();
    await addWorkersWithSeverity();
    console.log('\n✅ Worker seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Worker seeding process failed:', error);
    process.exit(1);
  }
};

runWorkerSeeding();