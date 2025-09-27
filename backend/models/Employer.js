
import mongoose from "mongoose";

const EmployerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  companyName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  address: { type: String },
  district: { type: String },
  pincode: { type: String },
});

export default mongoose.model('Employer', EmployerSchema);
