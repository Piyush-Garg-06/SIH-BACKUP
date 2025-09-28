import { Server } from 'socket.io';
import DiseaseAlert from '../models/DiseaseAlert.js';
import User from '../models/User.js';

class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:5174',
          'http://localhost:5173',
          'http://localhost:5174',
          'http://192.168.1.68:5174'
        ],
        credentials: true
      }
    });
    
    this.userSockets = new Map(); // Map user IDs to socket IDs
    this.initialize();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Handle user authentication
      socket.on('authenticate', async (userId) => {
        try {
          // Store the mapping of user ID to socket ID
          this.userSockets.set(userId, socket.id);
          socket.userId = userId;
          
          console.log(`User ${userId} authenticated with socket ${socket.id}`);
          
          // Send any unread alerts to the user
          await this.sendUnreadAlertsToUser(userId);
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Remove the user from the map
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
        }
      });
    });
  }

  // Send alert to specific users
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
      
      // Send alert to each connected user
      for (const user of users) {
        const socketId = this.userSockets.get(user._id.toString());
        if (socketId) {
          this.io.to(socketId).emit('diseaseAlert', {
            alert: alert,
            type: 'newAlert'
          });
        }
      }
      
      console.log(`Sent alert to ${users.length} users`);
    } catch (error) {
      console.error('Error sending alert to users:', error);
    }
  }

  // Send alert to a specific user
  sendAlertToUser(userId, alert) {
    const socketId = this.userSockets.get(userId.toString());
    if (socketId) {
      this.io.to(socketId).emit('diseaseAlert', {
        alert: alert,
        type: 'newAlert'
      });
      return true;
    }
    return false;
  }

  // Send unread alerts to a specific user
  async sendUnreadAlertsToUser(userId) {
    try {
      // Find alerts where the user is in the target recipients or it's for all
      const alerts = await DiseaseAlert.find({
        $and: [
          { isResolved: false },
          {
            $or: [
              { 'targetRecipients.role': 'all' },
              { 'targetRecipients.role': (await User.findById(userId)).role },
              { 'sentTo.user': userId }
            ]
          },
          {
            $or: [
              { expiresAt: { $exists: false } },
              { expiresAt: { $gte: new Date() } }
            ]
          }
        ]
      })
      .sort({ createdAt: -1 })
      .populate('outbreak', 'diseaseName area district state');

      // Filter out alerts that the user has already read
      const unreadAlerts = alerts.filter(alert => {
        const userReadStatus = alert.sentTo.find(item => 
          item.user.toString() === userId.toString()
        );
        return !userReadStatus || !userReadStatus.read;
      });

      const socketId = this.userSockets.get(userId.toString());
      if (socketId && unreadAlerts.length > 0) {
        this.io.to(socketId).emit('unreadAlerts', {
          alerts: unreadAlerts,
          type: 'unreadAlerts'
        });
      }
      
      console.log(`Sent ${unreadAlerts.length} unread alerts to user ${userId}`);
    } catch (error) {
      console.error('Error sending unread alerts to user:', error);
    }
  }

  // Broadcast alert to all connected users
  broadcastAlert(alert) {
    this.io.emit('diseaseAlert', {
      alert: alert,
      type: 'broadcast'
    });
  }

  // Notify users when an alert is resolved
  async notifyAlertResolved(alert) {
    try {
      // Find users who received this alert
      const userIds = alert.sentTo.map(item => item.user.toString());
      
      // Send resolution notification to each connected user
      for (const userId of userIds) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
          this.io.to(socketId).emit('alertResolved', {
            alert: alert,
            type: 'alertResolved'
          });
        }
      }
      
      console.log(`Notified ${userIds.length} users about resolved alert`);
    } catch (error) {
      console.error('Error notifying about resolved alert:', error);
    }
  }
}

export default WebSocketService;