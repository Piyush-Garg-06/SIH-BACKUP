
import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  aadhaar: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  nativeState: { type: String, required: true },
  address: { type: String },
  district: { type: String },
  pincode: { type: String },
  
  bloodGroup: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  disabilities: { type: String, default: 'no' },
  chronicConditions: [{ type: String }],
  vaccinations: [{ type: String }],
  employmentType: { type: String, required: true },
  employerName: { type: String, required: true },
  employerContact: { type: String },
  workLocation: { type: String, required: true },
  workAddress: { type: String },
  duration: { type: String },
  familyMembers: { type: Number },
  healthId: { type: String, unique: true, sparse: true },
});

export default mongoose.model('Worker', WorkerSchema);
