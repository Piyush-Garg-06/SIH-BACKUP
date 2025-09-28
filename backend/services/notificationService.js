import nodemailer from 'nodemailer';
import twilio from 'twilio';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import connectDB from '../config/db.js';

class NotificationService {
  constructor() {
    // Email configuration - only initialize if environment variables are present
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.emailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      console.warn('Email credentials not found. Email functionality will be disabled.');
      this.emailTransporter = null;
    }

    // SMS configuration - only initialize if environment variables are present
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } else {
      console.warn('Twilio credentials not found. SMS functionality will be disabled.');
      this.twilioClient = null;
    }
  }

  // Send email notification
  async sendEmail(to, subject, html) {
    try {
      if (!this.emailTransporter) {
        console.warn('Email functionality is disabled. Cannot send email.');
        return null;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  // Send SMS notification
  async sendSMS(to, message) {
    try {
      if (!this.twilioClient) {
        console.warn('SMS functionality is disabled. Cannot send SMS.');
        return null;
      }

      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
      console.log('SMS sent successfully:', result.sid);
      return result;
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  }

  // Send health checkup reminder
  async sendHealthCheckupReminder(user, checkupDate) {
    const subject = 'Health Checkup Reminder';
    const html = `
      <h3>Health Checkup Reminder</h3>
      <p>Dear ${user.firstName},</p>
      <p>This is a reminder for your scheduled health checkup on ${checkupDate}.</p>
      <p>Please ensure to carry your health card and arrive 15 minutes before the appointment.</p>
      <p>Stay healthy!</p>
      <p>Best regards,<br>Digital Health Record Management System</p>
    `;

    const smsMessage = `Health Checkup Reminder: Dear ${user.firstName}, your health checkup is scheduled for ${checkupDate}. Please carry your health card. Stay healthy!`;

    try {
      await this.sendEmail(user.email, subject, html);
      await this.sendSMS(user.mobile, smsMessage);
      console.log('Health checkup reminder sent successfully');
    } catch (error) {
      console.error('Failed to send health checkup reminder:', error);
    }
  }

  // Send appointment confirmation
  async sendAppointmentConfirmation(user, appointmentDetails) {
    const subject = 'Appointment Confirmation';
    const html = `
      <h3>Appointment Confirmed</h3>
      <p>Dear ${user.firstName},</p>
      <p>Your appointment has been confirmed with the following details:</p>
      <ul>
        <li><strong>Doctor:</strong> ${appointmentDetails.doctorName}</li>
        <li><strong>Date:</strong> ${appointmentDetails.date}</li>
        <li><strong>Time:</strong> ${appointmentDetails.time}</li>
        <li><strong>Location:</strong> ${appointmentDetails.location}</li>
      </ul>
      <p>Please arrive 15 minutes before the scheduled time.</p>
      <p>Best regards,<br>Digital Health Record Management System</p>
    `;

    const smsMessage = `Appointment Confirmed: Dear ${user.firstName}, your appointment with ${appointmentDetails.doctorName} is confirmed for ${appointmentDetails.date} at ${appointmentDetails.time}.`;

    try {
      await this.sendEmail(user.email, subject, html);
      await this.sendSMS(user.mobile, smsMessage);
      console.log('Appointment confirmation sent successfully');
    } catch (error) {
      console.error('Failed to send appointment confirmation:', error);
    }
  }

  // Send health update notification
  async sendHealthUpdate(user, updateDetails) {
    const subject = 'Health Record Update';
    const html = `
      <h3>Health Record Updated</h3>
      <p>Dear ${user.firstName},</p>
      <p>Your health record has been updated with the following information:</p>
      <p><strong>Diagnosis:</strong> ${updateDetails.diagnosis}</p>
      <p><strong>Treatment:</strong> ${updateDetails.treatment}</p>
      <p><strong>Next Follow-up:</strong> ${updateDetails.followUpDate || 'Not scheduled'}</p>
      <p>Please follow the prescribed treatment and attend follow-up appointments as scheduled.</p>
      <p>Best regards,<br>Digital Health Record Management System</p>
    `;

    const smsMessage = `Health Update: Dear ${user.firstName}, your health record has been updated. Diagnosis: ${updateDetails.diagnosis}. Please follow the prescribed treatment.`;

    try {
      await this.sendEmail(user.email, subject, html);
      await this.sendSMS(user.mobile, smsMessage);
      console.log('Health update notification sent successfully');
    } catch (error) {
      console.error('Failed to send health update notification:', error);
    }
  }

  // Send appointment request notification to doctor
  async sendAppointmentRequestNotification(doctorUser, worker, appointmentDetails, appointmentId) {
    try {
      // Ensure database connection
      // await connectDB();
      
      console.log('Creating notification for doctor:', doctorUser._id);
      console.log('Appointment ID:', appointmentId);
      
      // Create in-app notification
      const notification = new Notification({
        userId: doctorUser._id,
        title: 'New Appointment Request',
        message: `New appointment request from ${worker.firstName} ${worker.lastName} for ${appointmentDetails.date} at ${appointmentDetails.time}`,
        type: 'appointment',
        priority: 'high',
        actionUrl: `/doctor/appointments/${appointmentId}`,
        actionText: 'View Appointment',
        relatedType: 'appointment',
        relatedId: appointmentId
      });

      const savedNotification = await notification.save();
      console.log('Notification saved:', savedNotification._id);
      console.log('Notification data:', savedNotification);
      
      // Send email notification if enabled
      if (this.emailTransporter && doctorUser.email) {
        const subject = 'New Appointment Request';
        const html = `
          <h3>New Appointment Request</h3>
          <p>Dear Dr. ${doctorUser.firstName} ${doctorUser.lastName},</p>
          <p>You have received a new appointment request with the following details:</p>
          <ul>
            <li><strong>Patient:</strong> ${worker.firstName} ${worker.lastName}</li>
            <li><strong>Date:</strong> ${appointmentDetails.date}</li>
            <li><strong>Time:</strong> ${appointmentDetails.time}</li>
            <li><strong>Type:</strong> ${appointmentDetails.type}</li>
            <li><strong>Hospital:</strong> ${appointmentDetails.hospital}</li>
          </ul>
          <p>Please log in to the system to review and confirm this appointment.</p>
          <p>Best regards,<br>Digital Health Record Management System</p>
        `;

        try {
          await this.sendEmail(doctorUser.email, subject, html);
        } catch (error) {
          console.error('Failed to send appointment request email to doctor:', error);
        }
      }

      // Send SMS notification if enabled
      if (this.twilioClient && doctorUser.mobile) {
        const smsMessage = `New Appointment Request: ${worker.firstName} ${worker.lastName} requested an appointment for ${appointmentDetails.date} at ${appointmentDetails.time}. Please log in to review.`;

        try {
          await this.sendSMS(doctorUser.mobile, smsMessage);
        } catch (error) {
          console.error('Failed to send appointment request SMS to doctor:', error);
        }
      }

      console.log('Appointment request notification sent to doctor');
      return savedNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Send appointment accepted notification to worker
  async sendAppointmentAcceptedNotification(workerUser, worker, appointmentDetails, appointmentId) {
    try {
      console.log('Creating notification for worker:', workerUser._id);
      console.log('Appointment ID:', appointmentId);
      
      // Create in-app notification
      const notification = new Notification({
        userId: workerUser._id,
        title: 'Appointment Accepted',
        message: `Your appointment with Dr. ${appointmentDetails.doctorName} for ${appointmentDetails.date} at ${appointmentDetails.time} has been accepted`,
        type: 'appointment',
        priority: 'normal',
        actionUrl: `/appointments`,
        actionText: 'View Appointment',
        relatedType: 'appointment',
        relatedId: appointmentId
      });

      const savedNotification = await notification.save();
      console.log('Acceptance notification saved:', savedNotification._id);
      
      // Send email notification if enabled
      if (this.emailTransporter && workerUser.email) {
        const subject = 'Appointment Accepted';
        const html = `
          <h3>Appointment Accepted</h3>
          <p>Dear ${worker.firstName} ${worker.lastName},</p>
          <p>Your appointment request has been accepted with the following details:</p>
          <ul>
            <li><strong>Doctor:</strong> Dr. ${appointmentDetails.doctorName}</li>
            <li><strong>Date:</strong> ${appointmentDetails.date}</li>
            <li><strong>Time:</strong> ${appointmentDetails.time}</li>
            <li><strong>Hospital:</strong> ${appointmentDetails.hospital}</li>
          </ul>
          <p>Please arrive 15 minutes before the scheduled time.</p>
          <p>Best regards,<br>Digital Health Record Management System</p>
        `;

        try {
          await this.sendEmail(workerUser.email, subject, html);
        } catch (error) {
          console.error('Failed to send appointment acceptance email to worker:', error);
        }
      }

      // Send SMS notification if enabled
      if (this.twilioClient && workerUser.mobile) {
        const smsMessage = `Appointment Accepted: Dear ${worker.firstName}, your appointment with Dr. ${appointmentDetails.doctorName} for ${appointmentDetails.date} at ${appointmentDetails.time} has been accepted.`;

        try {
          await this.sendSMS(workerUser.mobile, smsMessage);
        } catch (error) {
          console.error('Failed to send appointment acceptance SMS to worker:', error);
        }
      }

      console.log('Appointment acceptance notification sent to worker');
      return savedNotification;
    } catch (error) {
      console.error('Error creating acceptance notification:', error);
      throw error;
    }
  }

  // Send appointment rejected notification to worker
  async sendAppointmentRejectedNotification(workerUser, worker, appointmentDetails, appointmentId) {
    try {
      console.log('Creating rejection notification for worker:', workerUser._id);
      console.log('Appointment ID:', appointmentId);
      
      // Create in-app notification
      const notification = new Notification({
        userId: workerUser._id,
        title: 'Appointment Rejected',
        message: `Your appointment with Dr. ${appointmentDetails.doctorName} for ${appointmentDetails.date} at ${appointmentDetails.time} has been rejected`,
        type: 'appointment',
        priority: 'normal',
        actionUrl: `/appointments`,
        actionText: 'View Appointment',
        relatedType: 'appointment',
        relatedId: appointmentId
      });

      const savedNotification = await notification.save();
      console.log('Rejection notification saved:', savedNotification._id);
      
      // Send email notification if enabled
      if (this.emailTransporter && workerUser.email) {
        const subject = 'Appointment Rejected';
        const html = `
          <h3>Appointment Rejected</h3>
          <p>Dear ${worker.firstName} ${worker.lastName},</p>
          <p>Unfortunately, your appointment request with Dr. ${appointmentDetails.doctorName} for ${appointmentDetails.date} at ${appointmentDetails.time} has been rejected.</p>
          <p>You can schedule another appointment or contact the hospital directly for more information.</p>
          <p>Best regards,<br>Digital Health Record Management System</p>
        `;

        try {
          await this.sendEmail(workerUser.email, subject, html);
        } catch (error) {
          console.error('Failed to send appointment rejection email to worker:', error);
        }
      }

      // Send SMS notification if enabled
      if (this.twilioClient && workerUser.mobile) {
        const smsMessage = `Appointment Rejected: Dear ${worker.firstName}, your appointment with Dr. ${appointmentDetails.doctorName} for ${appointmentDetails.date} at ${appointmentDetails.time} has been rejected.`;

        try {
          await this.sendSMS(workerUser.mobile, smsMessage);
        } catch (error) {
          console.error('Failed to send appointment rejection SMS to worker:', error);
        }
      }

      console.log('Appointment rejection notification sent to worker');
      return savedNotification;
    } catch (error) {
      console.error('Error creating rejection notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();