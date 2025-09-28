import mongoose from "mongoose";

const DiseaseOutbreakSchema = new mongoose.Schema({
  diseaseName: {
    type: String,
    required: true,
    index: true
  },
  diseaseCode: {
    type: String,
    required: true,
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
      required: true
    }
  },
  area: {
    type: String,
    required: true,
    index: true
  },
  district: {
    type: String,
    required: true,
    index: true
  },
  state: {
    type: String,
    required: true,
    index: true
  },
  pincode: {
    type: String,
    index: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  hospitalName: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedByRole: {
    type: String,
    enum: ['doctor', 'admin', 'hospital_staff'],
    required: true
  },
  casesReported: {
    type: Number,
    required: true,
    min: 1
  },
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'moderate'
  },
  outbreakStatus: {
    type: String,
    enum: ['investigating', 'confirmed', 'contained', 'resolved'],
    default: 'investigating'
  },
  symptoms: [{
    type: String
  }],
  affectedAgeGroups: [{
    type: String,
    enum: ['0-5', '6-12', '13-18', '19-30', '31-50', '51-65', '65+']
  }],
  transmissionType: {
    type: String,
    enum: ['airborne', 'waterborne', 'vector-borne', 'foodborne', 'contact', 'unknown']
  },
  firstReportedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  containmentMeasures: [{
    type: String
  }],
  notes: {
    type: String
  },
  isAlertSent: {
    type: Boolean,
    default: false
  },
  alertRecipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
DiseaseOutbreakSchema.index({ location: "2dsphere" });

// Create compound indexes for common queries
DiseaseOutbreakSchema.index({ diseaseName: 1, district: 1, state: 1 });
DiseaseOutbreakSchema.index({ severity: 1, outbreakStatus: 1 });
DiseaseOutbreakSchema.index({ firstReportedDate: -1 });

export default mongoose.model('DiseaseOutbreak', DiseaseOutbreakSchema);