import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['worker', 'doctor', 'employer', 'admin', 'patient', 'emitra'], // Added 'emitra' to enum
    default: 'patient', // Changed default role to 'patient'
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
  },
  patient: { // Added patient reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  emitra: { // Added emitra reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emitra',
  },
});

export default mongoose.model('User', UserSchema);