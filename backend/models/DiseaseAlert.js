import mongoose from "mongoose";

const DiseaseAlertSchema = new mongoose.Schema({
  outbreak: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiseaseOutbreak',
    required: true
  },
  alertType: {
    type: String,
    enum: ['outbreak', 'warning', 'advisory', 'resolution'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
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
  affectedAreas: [{
    type: String
  }],
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  targetRecipients: [{
    role: {
      type: String,
      enum: ['doctor', 'hospital_staff', 'admin', 'public_health_official', 'all']
    },
    department: String
  }],
  sentTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date
  },
  resolutionNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
DiseaseAlertSchema.index({ severity: 1, createdAt: -1 });
DiseaseAlertSchema.index({ district: 1, state: 1 });
DiseaseAlertSchema.index({ expiresAt: 1 });
DiseaseAlertSchema.index({ isResolved: 1 });

export default mongoose.model('DiseaseAlert', DiseaseAlertSchema);