import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['appointment', 'health_alert', 'scheme', 'general'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String
  },
  actionText: {
    type: String
  },
  relatedId: {
    // ID of related entity (appointment, health record, etc.)
    type: mongoose.Schema.Types.ObjectId
  },
  relatedType: {
    // Type of related entity
    type: String,
    enum: ['appointment', 'healthRecord', 'scheme']
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', NotificationSchema);