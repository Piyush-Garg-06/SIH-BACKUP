import DiseaseAlert from '../models/DiseaseAlert.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { webSocketService } from '../server.js';

class DiseaseNotificationService {
  // Send alert to specific users based on roles and locations
  async sendAlertToUsers(alert) {
    try {
      // Find users based on target recipients
      let query = {};
      
      if (alert.targetRecipients.some(recipient => recipient.role === 'all')) {
        // Send to all users
        query = {};
      } else {
        // Send to specific roles
        const roles = alert.targetRecipients.map(recipient => recipient.role);
        query = { role: { $in: roles } };
      }

      const users = await User.find(query);
      
      // Create notifications for each user
      const notifications = users.map(user => ({
        user: user._id,
        type: 'disease_alert',
        title: alert.title,
        message: alert.message,
        priority: this.getPriorityForSeverity(alert.severity),
        relatedId: alert._id,
        relatedType: 'DiseaseAlert'
      }));

      // Insert all notifications at once
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      // Update alert with sent users
      alert.sentTo = users.map(user => ({
        user: user._id,
        read: false
      }));
      
      await alert.save();

      // Send real-time alert via WebSocket
      if (webSocketService) {
        await webSocketService.sendAlertToUsers(alert);
      }

      return { success: true, notificationsSent: notifications.length };
    } catch (error) {
      console.error('Error sending disease alert:', error);
      return { success: false, error: error.message };
    }
  }

  // Get priority based on severity
  getPriorityForSeverity(severity) {
    switch (severity) {
      case 'critical': return 'high';
      case 'high': return 'high';
      case 'moderate': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  // Send outbreak notification to relevant stakeholders
  async sendOutbreakNotification(outbreak) {
    try {
      // Find doctors and hospital staff in the same district/state
      const users = await User.find({
        $or: [
          { role: 'doctor' },
          { role: 'hospital_staff' },
          { role: 'admin' }
        ],
        'profile.district': new RegExp(outbreak.district, 'i'),
        'profile.state': new RegExp(outbreak.state, 'i')
      });

      // Create notifications
      const notifications = users.map(user => ({
        user: user._id,
        type: 'disease_outbreak',
        title: `New ${outbreak.diseaseName} Outbreak Reported`,
        message: `${outbreak.casesReported} cases reported in ${outbreak.area}, ${outbreak.district}`,
        priority: this.getPriorityForSeverity(outbreak.severity),
        relatedId: outbreak._id,
        relatedType: 'DiseaseOutbreak'
      }));

      // Insert all notifications
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      return { success: true, notificationsSent: notifications.length };
    } catch (error) {
      console.error('Error sending outbreak notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Create automatic alerts based on outbreak patterns
  async createAutomaticAlert(outbreak) {
    try {
      // If severity is high or critical, create an alert automatically
      if (['high', 'critical'].includes(outbreak.severity)) {
        const alert = new DiseaseAlert({
          outbreak: outbreak._id,
          alertType: 'outbreak',
          severity: outbreak.severity,
          title: `${outbreak.diseaseName} Outbreak Alert`,
          message: `A ${outbreak.severity} severity ${outbreak.diseaseName} outbreak has been reported with ${outbreak.casesReported} cases in ${outbreak.area}, ${outbreak.district}. Immediate attention required.`,
          affectedAreas: [outbreak.area],
          district: outbreak.district,
          state: outbreak.state,
          targetRecipients: [
            { role: 'doctor' },
            { role: 'hospital_staff' },
            { role: 'admin' }
          ],
          createdBy: outbreak.reportedBy
        });

        const createdAlert = await alert.save();
        
        // Send notifications
        await this.sendAlertToUsers(createdAlert);

        return { success: true, alert: createdAlert };
      }

      return { success: true, alert: null };
    } catch (error) {
      console.error('Error creating automatic alert:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new DiseaseNotificationService();