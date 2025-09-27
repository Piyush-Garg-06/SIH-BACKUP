import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  contact: {
    type: String
  },
  email: {
    type: String
  },
  type: {
    type: String,
    enum: ['Government', 'Private', 'Charity'],
    default: 'Government'
  },
  specialties: [{
    type: String
  }],
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }]
}, {
  timestamps: true
});

export default mongoose.model('Hospital', HospitalSchema);