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
    console.log('MongoDB Connected for additional seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Add comprehensive additional data
const addAdditionalData = async () => {
  try {
    console.log('🧹 Clearing existing database...');
    
    // Clear all existing data
    await Appointment.deleteMany({});
    await HealthRecord.deleteMany({});
    await Patient.deleteMany({});
    await Worker.deleteMany({});
    await Doctor.deleteMany({});
    await User.deleteMany({});
    
    console.log('✅ Database cleared successfully!');
    console.log('🌱 Adding additional comprehensive data...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // ===== CREATE MORE DOCTORS =====
    console.log('👨‍⚕️ Creating additional doctors...');
    
    const additionalDoctors = [
      {
        email: 'dr.sarah@clinic.com',
        firstName: 'Dr. Sarah',
        lastName: 'Thomas',
        gender: 'female',
        dob: new Date('1982-05-18'),
        mobile: '9876543204',
        address: 'Medical Campus, Alappuzha',
        district: 'Alappuzha',
        pincode: '688001',
        registrationNumber: 'KMC12348',
        specialization: 'Family Medicine',
        clinicName: 'Thomas Family Clinic',
        clinicAddress: 'Boat Jetty Road, Alappuzha'
      },
      {
        email: 'dr.vinod@hospital.com',
        firstName: 'Dr. Vinod',
        lastName: 'Krishnan',
        gender: 'male',
        dob: new Date('1973-09-14'),
        mobile: '9876543205',
        address: 'Government Hospital, Kannur',
        district: 'Kannur',
        pincode: '670001',
        registrationNumber: 'KMC12349',
        specialization: 'Cardiology',
        clinicName: 'Heart Care Center',
        clinicAddress: 'Civil Station, Kannur'
      },
      {
        email: 'dr.meera@healthcenter.com',
        firstName: 'Dr. Meera',
        lastName: 'Menon',
        gender: 'female',
        dob: new Date('1985-01-25'),
        mobile: '9876543206',
        address: 'Specialty Hospital, Thrissur',
        district: 'Thrissur',
        pincode: '680001',
        registrationNumber: 'KMC12350',
        specialization: 'Pediatrics',
        clinicName: 'Child Care Clinic',
        clinicAddress: 'Round South, Thrissur'
      }
    ];

    const doctors = [];
    for (const doctorData of additionalDoctors) {
      const doctorUser = new User({
        email: doctorData.email,
        password: hashedPassword,
        role: 'doctor'
      });
      await doctorUser.save();

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

      doctorUser.doctor = doctor._id;
      await doctorUser.save();

      doctors.push(doctor);
      console.log(`✅ Created doctor: ${doctorData.firstName} ${doctorData.lastName}`);
    }

    // ===== CREATE MORE WORKERS =====
    console.log('👷‍♂️ Creating additional migrant workers...');
    
    const additionalWorkers = [
      {
        email: 'manjeet.worker@gmail.com',
        firstName: 'Manjeet',
        lastName: 'Singh',
        gender: 'male',
        dob: new Date('1984-03-12'),
        aadhaar: '123456789006',
        mobile: '9876543306',
        nativeState: 'Punjab',
        address: 'Migrant Colony, Munnar',
        district: 'Idukki',
        pincode: '685612',
        bloodGroup: 'A+',
        height: 175,
        weight: 72,
        employmentType: 'Tea Plantation Worker',
        employerName: 'Munnar Tea Estates',
        workLocation: 'Tea Gardens, Munnar'
      },
      {
        email: 'pradeep.worker@gmail.com',
        firstName: 'Pradeep',
        lastName: 'Gupta',
        gender: 'male',
        dob: new Date('1991-07-08'),
        aadhaar: '123456789007',
        mobile: '9876543307',
        nativeState: 'Madhya Pradesh',
        address: 'Industrial Estate, Kozhikode',
        district: 'Kozhikode',
        pincode: '673010',
        bloodGroup: 'B-',
        height: 168,
        weight: 58,
        employmentType: 'Textile Worker',
        employerName: 'Kerala Textiles Ltd',
        workLocation: 'Textile Mill, Kozhikode'
      },
      {
        email: 'ravi.fisherman@gmail.com',
        firstName: 'Ravi',
        lastName: 'Das',
        gender: 'male',
        dob: new Date('1986-11-22'),
        aadhaar: '123456789008',
        mobile: '9876543308',
        nativeState: 'West Bengal',
        address: 'Fishing Harbor, Kollam',
        district: 'Kollam',
        pincode: '691005',
        bloodGroup: 'O-',
        height: 162,
        weight: 55,
        employmentType: 'Fisherman',
        employerName: 'Coastal Fisheries Co-op',
        workLocation: 'Fishing Boats, Arabian Sea'
      },
      {
        email: 'santosh.mason@gmail.com',
        firstName: 'Santosh',
        lastName: 'Kumar',
        gender: 'male',
        dob: new Date('1989-04-15'),
        aadhaar: '123456789009',
        mobile: '9876543309',
        nativeState: 'Jharkhand',
        address: 'Construction Camp, Wayanad',
        district: 'Wayanad',
        pincode: '673121',
        bloodGroup: 'AB-',
        height: 170,
        weight: 65,
        employmentType: 'Mason',
        employerName: 'Hill Construction Co',
        workLocation: 'Resort Construction, Wayanad'
      },
      {
        email: 'dinesh.driver@gmail.com',
        firstName: 'Dinesh',
        lastName: 'Yadav',
        gender: 'male',
        dob: new Date('1983-12-01'),
        aadhaar: '123456789010',
        mobile: '9876543310',
        nativeState: 'Haryana',
        address: 'Transport Nagar, Kottayam',
        district: 'Kottayam',
        pincode: '686001',
        bloodGroup: 'A-',
        height: 173,
        weight: 70,
        employmentType: 'Truck Driver',
        employerName: 'Kerala Transport Corp',
        workLocation: 'Various Routes in Kerala'
      },
      {
        email: 'kumar.security@gmail.com',
        firstName: 'Kumar',
        lastName: 'Jha',
        gender: 'male',
        dob: new Date('1987-06-30'),
        aadhaar: '123456789011',
        mobile: '9876543311',
        nativeState: 'Bihar',
        address: 'Security Quarters, Kasaragod',
        district: 'Kasaragod',
        pincode: '671121',
        bloodGroup: 'B+',
        height: 169,
        weight: 63,
        employmentType: 'Security Guard',
        employerName: 'Elite Security Services',
        workLocation: 'Various Commercial Buildings'
      }
    ];

    const workers = [];
    for (const workerData of additionalWorkers) {
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

      workers.push(worker);
      console.log(`✅ Created worker: ${workerData.firstName} ${workerData.lastName}`);
    }

    // ===== CREATE MORE PATIENTS =====
    console.log('👥 Creating additional regular patients...');
    
    const additionalPatients = [
      {
        email: 'john.patient@gmail.com',
        firstName: 'John',
        lastName: 'Paul',
        gender: 'male',
        dob: new Date('1970-03-10'),
        aadhaar: '123456789104',
        mobile: '9876543504',
        nativeState: 'Kerala',
        address: 'Fort Kochi, Ernakulam',
        district: 'Ernakulam',
        pincode: '682001',
        bloodGroup: 'O+',
        chronicConditions: ['Diabetes']
      },
      {
        email: 'latha.patient@gmail.com',
        firstName: 'Latha',
        lastName: 'Kumari',
        gender: 'female',
        dob: new Date('1978-09-18'),
        aadhaar: '123456789105',
        mobile: '9876543505',
        nativeState: 'Kerala',
        address: 'Palayam, Thiruvananthapuram',
        district: 'Thiruvananthapuram',
        pincode: '695033',
        bloodGroup: 'A+',
        chronicConditions: ['Hypertension', 'Thyroid']
      },
      {
        email: 'thomas.patient@gmail.com',
        firstName: 'Thomas',
        lastName: 'Abraham',
        gender: 'male',
        dob: new Date('1955-12-25'),
        aadhaar: '123456789106',
        mobile: '9876543506',
        nativeState: 'Kerala',
        address: 'Mattancherry, Kochi',
        district: 'Ernakulam',
        pincode: '682002',
        bloodGroup: 'B+',
        chronicConditions: ['Heart Disease', 'Diabetes']
      },
      {
        email: 'priya.patient@gmail.com',
        firstName: 'Priya',
        lastName: 'Raj',
        gender: 'female',
        dob: new Date('1992-05-14'),
        aadhaar: '123456789107',
        mobile: '9876543507',
        nativeState: 'Kerala',
        address: 'Mananchira, Kozhikode',
        district: 'Kozhikode',
        pincode: '673001',
        bloodGroup: 'AB+',
        chronicConditions: []
      },
      {
        email: 'rajesh.patient@gmail.com',
        firstName: 'Rajesh',
        lastName: 'Nair',
        gender: 'male',
        dob: new Date('1988-08-07'),
        aadhaar: '123456789108',
        mobile: '9876543508',
        nativeState: 'Kerala',
        address: 'Statue Junction, Thrissur',
        district: 'Thrissur',
        pincode: '680001',
        bloodGroup: 'O-',
        chronicConditions: ['Asthma']
      },
      {
        email: 'kavitha.patient@gmail.com',
        firstName: 'Kavitha',
        lastName: 'Menon',
        gender: 'female',
        dob: new Date('1995-02-28'),
        aadhaar: '123456789109',
        mobile: '9876543509',
        nativeState: 'Kerala',
        address: 'Mullakkal, Alappuzha',
        district: 'Alappuzha',
        pincode: '688011',
        bloodGroup: 'A-',
        chronicConditions: []
      }
    ];

    const patients = [];
    for (const patientData of additionalPatients) {
      const healthId = healthCardService.generateHealthId();

      const patientUser = new User({
        email: patientData.email,
        password: hashedPassword,
        role: 'patient'
      });
      await patientUser.save();

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
        chronicConditions: patientData.chronicConditions || [],
        healthId: healthId
      });
      await patient.save();

      patients.push(patient);
      console.log(`✅ Created patient: ${patientData.firstName} ${patientData.lastName}`);
    }

    // ===== CREATE HEALTH RECORDS =====
    console.log('📋 Creating additional health records...');
    
    // Get all existing doctors from DB
    const allDoctors = await Doctor.find();
    const allPatients = [...workers, ...patients];
    
    const healthRecordsData = [
      {
        patientIndex: 0, // Manjeet Singh
        doctorIndex: 0,
        diagnosis: 'Occupational health assessment - Tea dust allergy',
        treatment: 'Antihistamines and protective mask usage',
        symptoms: 'Cough, sneezing due to tea dust exposure',
        severity: 'moderate'
      },
      {
        patientIndex: 1, // Pradeep Gupta
        doctorIndex: 1,
        diagnosis: 'Contact dermatitis from textile chemicals',
        treatment: 'Topical steroids and protective gloves',
        symptoms: 'Skin rash on hands and forearms',
        severity: 'normal'
      },
      {
        patientIndex: 2, // Ravi Das
        doctorIndex: 2,
        diagnosis: 'Minor fishing injury and health checkup',
        treatment: 'Wound care and tetanus booster',
        symptoms: 'Cut from fishing hook',
        severity: 'normal'
      },
      {
        patientIndex: 6, // John Paul (patient)
        doctorIndex: 0,
        diagnosis: 'Diabetes management and complications screening',
        treatment: 'Insulin adjustment and dietary counseling',
        symptoms: 'Frequent urination, fatigue',
        severity: 'moderate'
      },
      {
        patientIndex: 7, // Latha Kumari (patient)
        doctorIndex: 1,
        diagnosis: 'Hypertension and thyroid disorder management',
        treatment: 'Antihypertensive medications and thyroid hormone',
        symptoms: 'High blood pressure, weight gain',
        severity: 'moderate'
      },
      {
        patientIndex: 8, // Thomas Abraham (patient)
        doctorIndex: 2,
        diagnosis: 'Cardiac evaluation and diabetes control',
        treatment: 'Cardiac medications and diabetes management',
        symptoms: 'Chest pain, shortness of breath',
        severity: 'high'
      }
    ];

    for (const recordData of healthRecordsData) {
      const patient = allPatients[recordData.patientIndex];
      const doctor = allDoctors[recordData.doctorIndex];
      
      if (patient && doctor) {
        const healthRecord = new HealthRecord({
          worker: patient.employmentType ? patient._id : null,
          patient: !patient.employmentType ? patient._id : null,
          doctor: doctor._id,
          date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within last 60 days
          symptoms: recordData.symptoms,
          diagnosis: recordData.diagnosis,
          treatment: recordData.treatment,
          severity: recordData.severity,
          status: 'completed',
          hospitalName: doctor.clinicName || 'Health Center'
        });

        await healthRecord.save();
        console.log(`✅ Created health record for ${patient.firstName} ${patient.lastName}`);
      }
    }

    // ===== CREATE APPOINTMENTS =====
    console.log('📅 Creating additional appointments...');
    
    const appointmentsData = [
      {
        patientIndex: 3, // Santosh Kumar (worker)
        doctorIndex: 0,
        type: 'Health Checkup',
        status: 'scheduled',
        daysFromNow: 5
      },
      {
        patientIndex: 4, // Dinesh Yadav (worker)
        doctorIndex: 1,
        type: 'Follow-up',
        status: 'scheduled',
        daysFromNow: 10
      },
      {
        patientIndex: 9, // Priya Raj (patient)
        doctorIndex: 2,
        type: 'Vaccination',
        status: 'scheduled',
        daysFromNow: 15
      },
      {
        patientIndex: 10, // Rajesh Nair (patient)
        doctorIndex: 0,
        type: 'Emergency Consultation',
        status: 'scheduled',
        daysFromNow: 2
      }
    ];

    for (const appointmentData of appointmentsData) {
      const patient = allPatients[appointmentData.patientIndex];
      const doctor = allDoctors[appointmentData.doctorIndex];
      
      if (patient && doctor) {
        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + appointmentData.daysFromNow);
        
        const appointment = new Appointment({
          worker: patient.employmentType ? patient._id : null,
          patient: !patient.employmentType ? patient._id : null,
          doctor: doctor._id,
          date: appointmentDate,
          time: '11:00 AM',
          type: appointmentData.type,
          hospital: doctor.clinicName || 'Health Center',
          department: doctor.specialization,
          status: appointmentData.status,
          priority: 'normal',
          notes: `${appointmentData.type} appointment`,
          contact: patient.mobile
        });

        await appointment.save();
        console.log(`✅ Created appointment for ${patient.firstName} ${patient.lastName}`);
      }
    }

    console.log('\n🎉 Additional data creation completed successfully!');
    console.log('\n📊 Summary of Additional Data:');
    console.log(`👨‍⚕️ Additional doctors: ${doctors.length}`);
    console.log(`👷‍♂️ Additional workers: ${workers.length}`);
    console.log(`👥 Additional patients: ${patients.length}`);
    console.log(`📋 Additional health records: ${healthRecordsData.length}`);
    console.log(`📅 Additional appointments: ${appointmentsData.length}`);
    
    // Total counts
    const totalDoctors = await Doctor.countDocuments();
    const totalWorkers = await Worker.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const totalHealthRecords = await HealthRecord.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    
    console.log('\n📈 Total Database Counts:');
    console.log(`👨‍⚕️ Total doctors: ${totalDoctors}`);
    console.log(`👷‍♂️ Total workers: ${totalWorkers}`);
    console.log(`👥 Total patients: ${totalPatients}`);
    console.log(`📋 Total health records: ${totalHealthRecords}`);
    console.log(`📅 Total appointments: ${totalAppointments}`);
    console.log(`🏥 Total patients for doctors: ${totalWorkers + totalPatients}`);

  } catch (error) {
    console.error('❌ Error creating additional data:', error);
    throw error;
  }
};

// Main execution
const runAdditionalSeeding = async () => {
  try {
    await connectDB();
    await addAdditionalData();
    console.log('\n✅ Additional seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Additional seeding process failed:', error);
    process.exit(1);
  }
};

runAdditionalSeeding();