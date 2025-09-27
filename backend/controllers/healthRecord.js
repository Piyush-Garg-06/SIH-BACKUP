import HealthRecord from '../models/HealthRecord.js';
import Worker from '../models/Worker.js';
import Patient from '../models/Patient.js';
import PDFDocument from 'pdfkit';
import dataService from '../services/dataService.js';

// Create a new health record
export const createHealthRecord = async (req, res) => {
  const { workerId, symptoms, diagnosis, treatment, followUpDate, severity, status, prescriptions, tests, hospitalName } = req.body;
  const doctorId = req.user.id;

  try {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ msg: 'Worker not found' });
    }

    const newRecord = new HealthRecord({
      worker: workerId,
      doctor: doctorId,
      symptoms,
      diagnosis,
      treatment,
      followUpDate,
      severity,
      status,
      prescriptions,
      tests,
      hospitalName,
    });

    const healthRecord = await newRecord.save();
    res.json(healthRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all health records for a worker
export const getHealthRecords = async (req, res) => {
  try {
    const user = req.user;
    const workerId = req.params.workerId;

    // Verify the user owns this worker profile or is a doctor/admin
    if (user.role !== 'admin' && user.role !== 'doctor') {
      const worker = await Worker.findById(workerId);
      if (!worker || worker.user.toString() !== user.id) {
        return res.status(403).json({ msg: 'Not authorized to access these records' });
      }
    }

    const records = await dataService.getRecordsForUser(workerId, 'worker');
    res.json({ data: records });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all health records for a patient
export const getPatientRecords = async (req, res) => {
  try {
    const user = req.user;
    const patientId = req.params.patientId;

    // Verify the user owns this patient profile or is a doctor/admin
    if (user.role !== 'admin' && user.role !== 'doctor') {
      const patient = await Patient.findById(patientId);
      if (!patient || patient.user.toString() !== user.id) {
        return res.status(403).json({ msg: 'Not authorized to access these records' });
      }
    }

    const records = await dataService.getRecordsForUser(patientId, 'patient');
    res.json({ data: records });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get health records for the logged-in user
export const getMyHealthRecords = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'worker' && user.role !== 'patient') {
      return res.status(403).json({ msg: 'Only workers and patients can access their own records' });
    }

    let profileId;
    if (user.role === 'worker') {
      const workerProfile = await Worker.findOne({ user: user.id });
      if (!workerProfile) {
        return res.status(404).json({ msg: 'Worker profile not found' });
      }
      profileId = workerProfile._id;
    } else if (user.role === 'patient') {
      const patientProfile = await Patient.findOne({ user: user.id });
      if (!patientProfile) {
        return res.status(404).json({ msg: 'Patient profile not found' });
      }
      profileId = patientProfile._id;
    }

    const records = await dataService.getRecordsForUser(profileId, user.role);
    res.json({ data: records });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single health record by ID
export const getHealthRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id).populate('doctor', ['firstName', 'lastName', 'specialization']);
    if (!record) {
      return res.status(404).json({ msg: 'Health record not found' });
    }
    res.json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a health record
export const updateHealthRecord = async (req, res) => {
  const { symptoms, diagnosis, treatment, followUpDate, severity, status, prescriptions, tests, hospitalName } = req.body;

  try {
    let record = await HealthRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ msg: 'Health record not found' });
    }

    // Check if the user is the doctor who created the record
    if (record.doctor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const recordFields = { symptoms, diagnosis, treatment, followUpDate, severity, status, prescriptions, tests, hospitalName };

    record = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      { $set: recordFields },
      { new: true }
    );

    res.json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a health record
export const deleteHealthRecord = async (req, res) => {
  try {
    let record = await HealthRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ msg: 'Health record not found' });
    }

    // Check if the user is the doctor who created the record
    if (record.doctor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await HealthRecord.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Health record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Download health records as PDF
export const downloadHealthRecords = async (req, res) => {
  try {
    const { workerId } = req.params;

    const records = await dataService.getRecordsForUser(workerId, 'worker');

    if (!records || records.length === 0) {
      return res.status(404).json({ msg: 'No health records found for this worker.' });
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=health_records_${workerId}.pdf`);

    doc.pipe(res);

    doc.fontSize(25).text('Health Records', { align: 'center' });
    doc.moveDown();

    records.forEach((record, index) => {
      doc.fontSize(18).text(`Record #${index + 1}`);
      doc.fontSize(12).text(`Date: ${new Date(record.date).toLocaleDateString()}`);
      doc.text(`Doctor: ${record.doctor.firstName} ${record.doctor.lastName} (${record.doctor.specialization})`);
      doc.text(`Hospital: ${record.hospitalName || 'N/A'}`);
      doc.text(`Diagnosis: ${record.diagnosis}`);
      doc.text(`Symptoms: ${record.symptoms}`);
      doc.text(`Treatment: ${record.treatment}`);
      doc.text(`Severity: ${record.severity}`);
      doc.text(`Status: ${record.status}`);
      if (record.prescriptions && record.prescriptions.length > 0) {
        doc.text(`Prescriptions: ${record.prescriptions.join(', ')}`);
      }
      if (record.tests && record.tests.length > 0) {
        doc.text(`Tests: ${record.tests.join(', ')}`);
      }
      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};