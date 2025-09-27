import mongoose from 'mongoose';

const EmitraSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  operatorId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  centerName: {
    type: String,
    required: true,
  },
  centerLocation: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Emitra', EmitraSchema);