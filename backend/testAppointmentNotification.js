import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Worker from './models/Worker.js';
import Doctor from './models/Doctor.js';
import User from './models/User.js';
import Appointment from './models/Appointment.js';
import Notification from './models/Notification.js';
import notificationService from './services/notificationService.js';

dotenv.config();

const testAppointmentNotification = async () => {
  try {
    await connectDB();

    // Find a worker and doctor for testing
    const worker = await Worker.findOne().populate('user');
    const doctor = await Doctor.findOne().populate('user');
    
    if (!worker || !doctor) {
      console.log('No worker or doctor found for testing');
      process.exit(1);
    }

    console.log('Worker:', worker.firstName, worker.lastName);
    console.log('Doctor:', doctor.firstName, doctor.lastName);

    // Create a test appointment
    const appointmentData = {
      worker: worker._id,
      doctor: doctor._id,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: '10:00 AM',
      type: 'Health Checkup',
      hospital: 'Test Hospital',
      department: 'General Medicine',
      contact: worker.mobile,
      address: worker.address
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    console.log('Appointment created:', appointment._id);

    // Send notification to doctor
    const appointmentDetails = {
      date: new Date(appointmentData.date).toLocaleDateString(),
      time: appointmentData.time,
      type: appointmentData.type,
      hospital: appointmentData.hospital
    };

    const notification = await notificationService.sendAppointmentRequestNotification(
      doctor.user,
      worker,
      appointmentDetails
    );

    console.log('Notification sent successfully');
    console.log('Notification ID:', notification._id);

    // Check if notification was saved
    const savedNotifications = await Notification.find({ userId: doctor.user._id });
    console.log('Saved notifications for doctor:', savedNotifications.length);
    if (savedNotifications.length > 0) {
      console.log('Notification details:', JSON.stringify(savedNotifications[0], null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error in test:', error);
    process.exit(1);
  }
};

testAppointmentNotification();