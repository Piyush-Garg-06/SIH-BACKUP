import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Emitra from './models/Emitra.js';

dotenv.config();

const seedAdminEmitra = async () => {
  try {
    await connectDB();

    console.log('--- Creating Admin and eMitra Users ---');
    
    // Clear existing admin and emitra users (optional)
    // await User.deleteMany({ role: { $in: ['admin', 'emitra'] } });
    // await Emitra.deleteMany({});
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = await new User({ 
      email: 'admin@example.com', 
      password, 
      role: 'admin' 
    }).save();
    console.log('✅ Admin user created:', adminUser.email);

    // Create emitra users
    console.log('Creating eMitra users...');
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

    for (const emitraData of emitraUsersData) {
      // Create user account for emitra
      const emitraUser = new User({
        email: emitraData.email,
        password,
        role: 'emitra'
      });
      await emitraUser.save();

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

      // Update user with emitra reference
      emitraUser.emitra = emitraProfile._id;
      await emitraUser.save();

      console.log(`✅ eMitra user created: ${emitraData.email} (${emitraData.operatorId})`);
    }

    console.log('\n--- Database Seeded Successfully! ---');
    console.log('\n--- Login Credentials ---');
    console.log('Password for all users: password123');
    console.log(`Admin: ${adminUser.email}`);
    emitraUsersData.forEach(emitra => {
      console.log(`eMitra: ${emitra.email} (${emitra.operatorId})`);
    });

    process.exit();
  } catch (error) {
    console.error('Error seeding admin and emitra data:', error);
    process.exit(1);
  }
};

seedAdminEmitra();