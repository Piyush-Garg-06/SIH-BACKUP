import Employer from '../models/Employer.js';
import Worker from '../models/Worker.js';
import HealthRecord from '../models/HealthRecord.js';

export const getWorkersHealthStatus = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'employer') {
      return res.status(403).json({ msg: 'Access denied. Only employers can view worker health status.' });
    }

    const employerProfile = await Employer.findOne({ user: user.id });
    if (!employerProfile) {
      return res.status(404).json({ msg: 'Employer profile not found.' });
    }

    // Find workers associated with this employer
    // Assuming employerName in Worker model matches companyName in Employer profile
    const workers = await Worker.find({ employerName: employerProfile.companyName }).select('-password'); // Exclude sensitive info

    const workersHealthStatus = await Promise.all(workers.map(async (worker) => {
      // Get the latest health record for each worker
      const latestHealthRecord = await HealthRecord.findOne({ worker: worker._id })
        .sort({ date: -1 }) // Sort by date descending to get the latest
        .select('diagnosis date severity'); // Select relevant fields including severity

      const hasHealthRecords = !!latestHealthRecord;
      const overallHealthSeverity = latestHealthRecord ? latestHealthRecord.severity : 'normal';
      // For simplicity, compliance is based on having any health record. Can be expanded.
      const isCompliant = hasHealthRecords;

      return {
        workerId: worker._id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        healthId: worker.healthId,
        aadhaar: worker.aadhaar, // Add aadhaar for display
        latestDiagnosis: latestHealthRecord ? latestHealthRecord.diagnosis : 'No records',
        lastCheckupDate: latestHealthRecord ? latestHealthRecord.date : null,
        overallHealthSeverity,
        isCompliant,
      };
    }));

    res.json(workersHealthStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
