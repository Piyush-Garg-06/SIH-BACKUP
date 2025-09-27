import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Doctor from '../models/Doctor.js';
import Employer from '../models/Employer.js';
import Patient from '../models/Patient.js';

export const updateProfile = async (req, res) => {
  const { id, role } = req.user; // User ID and role from auth middleware
  const {
    firstName, lastName, gender, dob, aadhaar, mobile, nativeState, address, district, pincode,
    bloodGroup, height, weight, disabilities, chronicConditions, vaccinations,
    employmentType, employerName, employerContact, workLocation, workAddress, duration, familyMembers,
    specialization, registrationNumber, clinicName, clinicAddress,
    companyName, companyAddress
  } = req.body;

  try {
    let profile;
    let updateFields = {};

    switch (role) {
      case 'worker':
        profile = await Worker.findOne({ user: id });
        if (!profile) return res.status(404).json({ msg: 'Worker profile not found' });

        // Fields specific to Worker
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (gender) updateFields.gender = gender;
        if (dob) updateFields.dob = new Date(dob);
        if (aadhaar) updateFields.aadhaar = aadhaar;
        if (mobile) updateFields.mobile = mobile;
        if (nativeState) updateFields.nativeState = nativeState;
        if (address) updateFields.address = address;
        if (district) updateFields.district = district;
        if (pincode) updateFields.pincode = pincode;
        if (bloodGroup) updateFields.bloodGroup = bloodGroup;
        if (height) updateFields.height = Number(height);
        if (weight) updateFields.weight = Number(weight);
        if (disabilities) updateFields.disabilities = disabilities;
        if (chronicConditions) updateFields.chronicConditions = chronicConditions;
        if (vaccinations) updateFields.vaccinations = vaccinations;
        if (employmentType) updateFields.employmentType = employmentType;
        if (employerName) updateFields.employerName = employerName;
        if (employerContact) updateFields.employerContact = employerContact;
        if (workLocation) updateFields.workLocation = workLocation;
        if (workAddress) updateFields.workAddress = workAddress;
        if (duration) updateFields.duration = duration;
        if (familyMembers) updateFields.familyMembers = Number(familyMembers);

        profile = await Worker.findOneAndUpdate({ user: id }, { $set: updateFields }, { new: true });
        break;

      case 'doctor':
        profile = await Doctor.findOne({ user: id });
        if (!profile) return res.status(404).json({ msg: 'Doctor profile not found' });

        // Fields specific to Doctor
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (gender) updateFields.gender = gender;
        if (dob) updateFields.dob = new Date(dob);
        if (mobile) updateFields.mobile = mobile;
        if (address) updateFields.address = address;
        if (district) updateFields.district = district;
        if (pincode) updateFields.pincode = pincode;
        if (specialization) updateFields.specialization = specialization;
        if (registrationNumber) updateFields.registrationNumber = registrationNumber;
        if (clinicName) updateFields.clinicName = clinicName;
        if (clinicAddress) updateFields.clinicAddress = clinicAddress;

        profile = await Doctor.findOneAndUpdate({ user: id }, { $set: updateFields }, { new: true });
        break;

      case 'employer':
        profile = await Employer.findOne({ user: id });
        if (!profile) return res.status(404).json({ msg: 'Employer profile not found' });

        // Fields specific to Employer
        if (companyName) updateFields.companyName = companyName;
        if (mobile) updateFields.mobile = mobile;
        if (address) updateFields.address = address; // Employer address
        if (district) updateFields.district = district;
        if (pincode) updateFields.pincode = pincode;
        if (companyAddress) updateFields.address = companyAddress; // Use companyAddress for employer's address field

        profile = await Employer.findOneAndUpdate({ user: id }, { $set: updateFields }, { new: true });
        break;

      case 'patient':
        profile = await Patient.findOne({ user: id });
        if (!profile) return res.status(404).json({ msg: 'Patient profile not found' });

        // Fields specific to Patient (similar to worker for personal/health info)
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (gender) updateFields.gender = gender;
        if (dob) updateFields.dob = new Date(dob);
        if (aadhaar) updateFields.aadhaar = aadhaar;
        if (mobile) updateFields.mobile = mobile;
        if (nativeState) updateFields.nativeState = nativeState;
        if (address) updateFields.address = address;
        if (district) updateFields.district = district;
        if (pincode) updateFields.pincode = pincode;
        if (bloodGroup) updateFields.bloodGroup = bloodGroup;
        if (height) updateFields.height = Number(height);
        if (weight) updateFields.weight = Number(weight);
        if (disabilities) updateFields.disabilities = disabilities;
        if (chronicConditions) updateFields.chronicConditions = chronicConditions;
        if (vaccinations) updateFields.vaccinations = vaccinations;

        profile = await Patient.findOneAndUpdate({ user: id }, { $set: updateFields }, { new: true });
        break;

      default:
        return res.status(400).json({ msg: 'Invalid user role for profile update' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
