import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Notification from './models/Notification.js';

dotenv.config();

const testDeleteNotification = async () => {
  try {
    await connectDB();

    // Create a test notification
    const notification = new Notification({
      userId: '68d7b6a4141de3e5070d551e', // Test user ID
      title: 'Test Notification',
      message: 'This is a test notification for deletion',
      type: 'appointment',
      priority: 'normal'
    });

    const savedNotification = await notification.save();
    console.log('Notification created:', savedNotification._id);

    // Try to delete the notification
    const deletedNotification = await Notification.findByIdAndDelete(savedNotification._id);
    console.log('Notification deleted:', deletedNotification._id);

    // Verify it's deleted
    const foundNotification = await Notification.findById(savedNotification._id);
    console.log('Notification found after deletion:', foundNotification);

    process.exit(0);
  } catch (error) {
    console.error('Error in test:', error);
    process.exit(1);
  }
};

testDeleteNotification();