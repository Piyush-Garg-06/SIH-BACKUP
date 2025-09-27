import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  address: { type: String },
  district: { type: String },
  pincode: { type: String },
  registrationNumber: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  clinicName: { type: String },
  clinicAddress: { type: String },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  }
});

DoctorSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('Doctor', DoctorSchema);