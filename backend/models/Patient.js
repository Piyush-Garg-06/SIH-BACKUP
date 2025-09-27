import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  aadhaar: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  nativeState: { type: String },
  address: { type: String },
  district: { type: String },
  pincode: { type: String },
  
  bloodGroup: { type: String },
  height: { type: Number },
  weight: { type: Number },
  disabilities: { type: String, default: 'no' },
  chronicConditions: [{ type: String }],
  vaccinations: [{ type: String }],
  healthId: { type: String, unique: true, sparse: true },
});

export default mongoose.model('Patient', PatientSchema);
