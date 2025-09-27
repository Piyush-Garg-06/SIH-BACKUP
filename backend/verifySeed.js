import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Emitra from './models/Emitra.js';

dotenv.config();

const verifySeed = async () => {
  try {
    await connectDB();

    console.log('--- Verifying Seeded Data ---');
    
    // Check admin user
    const adminUser = await User.findOne({ email: 'admin@example.com', role: 'admin' });
    console.log('Admin User:', adminUser ? '✅ Found' : '❌ Not found');
    
    // Check emitra users
    const emitraUsers = await User.find({ role: 'emitra' });
    console.log(`eMitra Users: ✅ Found ${emitraUsers.length} users`);
    
    // Check emitra profiles
    const emitraProfiles = await Emitra.find({});
    console.log(`eMitra Profiles: ✅ Found ${emitraProfiles.length} profiles`);
    
    // Display emitra details
    for (const profile of emitraProfiles) {
      console.log(`  - ${profile.fullName} (${profile.operatorId}) at ${profile.centerName}`);
    }
    
    console.log('\n--- Verification Complete ---');
    
    process.exit();
  } catch (error) {
    console.error('Error verifying seed data:', error);
    process.exit(1);
  }
};

verifySeed();