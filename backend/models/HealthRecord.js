import mongoose from "mongoose";

const HealthRecordSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: false,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: false,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  symptoms: { type: String },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  followUpDate: { type: Date },
  severity: {
    type: String,
    enum: ['critical', 'high', 'moderate', 'normal'],
    default: 'normal',
  },
  status: {
    type: String,
    enum: ['completed', 'scheduled', 'pending'],
    default: 'completed',
  },
  prescriptions: [{ type: String }],
  tests: [{ type: String }],
  hospitalName: { type: String },
});

export default mongoose.model('HealthRecord', HealthRecordSchema);