import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Notification from './models/Notification.js';

dotenv.config();

const testNotificationAPI = async () => {
  try {
    await connectDB();

    // Create a test notification
    console.log('Creating test notification...');
    const notification = new Notification({
      userId: '68d7b6a4141de3e5070d551e', // Test doctor user ID
      title: 'Test API Notification',
      message: 'This notification is for testing the API',
      type: 'appointment',
      priority: 'high'
    });

    const savedNotification = await notification.save();
    console.log('Notification created with ID:', savedNotification._id);

    // Verify it exists
    const foundNotification = await Notification.findById(savedNotification._id);
    console.log('Notification found:', foundNotification.title);

    // Test delete functionality
    console.log('Deleting notification...');
    await Notification.deleteOne({ _id: savedNotification._id });
    
    // Verify it's deleted
    const deletedNotification = await Notification.findById(savedNotification._id);
    console.log('Notification after deletion:', deletedNotification);

    if (deletedNotification === null) {
      console.log('✅ Delete functionality working correctly');
    } else {
      console.log('❌ Delete functionality not working');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error in test:', error);
    process.exit(1);
  }
};

testNotificationAPI();