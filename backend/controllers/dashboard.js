import Worker from '../models/Worker.js';
import Doctor from '../models/Doctor.js';
import Employer from '../models/Employer.js';
import Patient from '../models/Patient.js';
import HealthRecord from '../models/HealthRecord.js';
import Appointment from '../models/Appointment.js';
import dataService from '../services/dataService.js';

// --- FINAL REFACTORED VERSION ---

export const getWorkerDashboard = async (req, res) => {
  try {
    const user = req.user;
    const worker = await Worker.findOne({ user: user.id }).lean();
    if (!worker) {
      return res.status(404).json({ msg: 'Worker profile not found' });
    }

    const allRecords = await dataService.getRecordsForUser(worker._id, 'worker');
    const upcomingAppointments = await dataService.getUpcomingAppointmentsForUser(worker._id, 'worker');

    const latestHealthRecord = allRecords.length > 0 ? allRecords[0] : null; // Already sorted by date desc
    const totalHealthRecords = allRecords.length;
    const upcomingAppointmentsCount = upcomingAppointments.length;

    const healthStatus = latestHealthRecord ? 'Last Diagnosis: ' + latestHealthRecord.diagnosis : 'No records yet';
    const nextCheckup = latestHealthRecord && latestHealthRecord.followUpDate ? new Date(latestHealthRecord.followUpDate).toLocaleDateString() : 'Not Scheduled';

    const alerts = [];
    if (latestHealthRecord && latestHealthRecord.followUpDate) {
        const daysUntilFollowUp = (new Date(latestHealthRecord.followUpDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (daysUntilFollowUp <= 7 && daysUntilFollowUp > 0) {
            alerts.push({ type: 'warning', message: `You have a follow-up in ${Math.ceil(daysUntilFollowUp)} days.` });
        }
    }

    const dashboardData = {
      title: 'Migrant Worker Dashboard',
      subtitle: 'Manage your health records and stay compliant',
      stats: [
        { label: 'Health Status', value: healthStatus, color: 'blue', icon: 'Activity' },
        { label: 'Next Checkup', value: nextCheckup, color: 'green', icon: 'Calendar' },
        { label: 'Total Records', value: totalHealthRecords, color: 'orange', icon: 'FileText' },
        { label: 'Upcoming Appointments', value: upcomingAppointmentsCount, color: 'yellow', icon: 'Clock' }
      ],
      cards: [
        { icon: 'QrCode', title: 'My Health Card', path: '/healthcard', color: 'blue' },
        { icon: 'FileText', title: 'Medical Records', path: '/health-records', color: 'green' },
        { icon: 'Calendar', title: 'Appointments', path: '/appointments', color: 'purple' },
        { icon: 'Bell', title: 'Notifications', path: '/notifications', color: 'yellow' }
      ],
      alerts: alerts,
      userProfile: worker
    };
    res.json(dashboardData);
  } catch (err) {
    console.error(`Error in getWorkerDashboard: ${err.message}`);
    res.status(500).send('Server Error');
  }
};

export const getPatientDashboard = async (req, res) => {
    try {
      const user = req.user;
      const patient = await Patient.findOne({ user: user.id }).lean();
      if (!patient) {
        return res.status(404).json({ msg: 'Patient profile not found' });
      }

      const allRecords = await dataService.getRecordsForUser(patient._id, 'patient');
      const upcomingAppointments = await dataService.getUpcomingAppointmentsForUser(patient._id, 'patient');

      const latestHealthRecord = allRecords.length > 0 ? allRecords[0] : null; // Already sorted by date desc
      const totalHealthRecords = allRecords.length;
      const upcomingAppointmentsCount = upcomingAppointments.length;

      const healthStatus = latestHealthRecord ? 'Last Diagnosis: ' + latestHealthRecord.diagnosis : 'No records yet';
      const nextCheckup = latestHealthRecord && latestHealthRecord.followUpDate ? new Date(latestHealthRecord.followUpDate).toLocaleDateString() : 'Not Scheduled';

      const alerts = [];
      if (latestHealthRecord && latestHealthRecord.followUpDate) {
        const daysUntilFollowUp = (new Date(latestHealthRecord.followUpDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (daysUntilFollowUp <= 7 && daysUntilFollowUp > 0) {
            alerts.push({ type: 'warning', message: `You have a follow-up in ${Math.ceil(daysUntilFollowUp)} days.` });
        }
      }

      const dashboardData = {
        title: 'Patient Dashboard',
        subtitle: 'Manage your health and appointments',
        stats: [
            { label: 'Health Status', value: healthStatus, color: 'blue', icon: 'Activity' },
            { label: 'Next Checkup', value: nextCheckup, color: 'green', icon: 'Calendar' },
            { label: 'Total Records', value: totalHealthRecords, color: 'orange', icon: 'FileText' },
            { label: 'Upcoming Appointments', value: upcomingAppointmentsCount, color: 'yellow', icon: 'Clock' }
        ],
        cards: [
            { icon: 'QrCode', title: 'My Health Card', path: '/healthcard', color: 'blue' },
            { icon: 'FileText', title: 'Medical Records', path: '/health-records', color: 'green' },
            { icon: 'Calendar', title: 'Appointments', path: '/appointments', color: 'purple' },
            { icon: 'Bell', title: 'Notifications', path: '/notifications', color: 'yellow' }
        ],
        alerts: alerts,
        userProfile: patient
      };
      res.json(dashboardData);
    } catch (err) {
        console.error(`Error in getPatientDashboard: ${err.message}`);
        res.status(500).send('Server Error');
    }
  };

// Other dashboard functions (Doctor, Employer, Admin) can be refactored similarly if needed,
// but the main issue reported was with worker/patient data consistency.
// For now, keeping them as they are to minimize changes, since they were not the source of the reported mismatch.

export const getDoctorDashboard = async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ user: req.user.id }).lean();
      if (!doctor) {
        return res.status(404).json({ msg: 'Doctor profile not found' });
      }
  
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
  
      const activePatientsCount = (await HealthRecord.distinct('worker', { doctor: doctor._id })).length +
                                  (await HealthRecord.distinct('patient', { doctor: doctor._id })).length;
      const pendingReportsCount = (await HealthRecord.find({
        doctor: doctor._id,
        diagnosis: { $exists: false },
        $or: [{ worker: { $exists: true } }, { patient: { $exists: true } }]
      })).length;
      const todaysAppointmentsCount = (await Appointment.find({ doctor: doctor._id, date: { $gte: startOfToday, $lte: endOfToday } })).length;
      const criticalCases = (await HealthRecord.find({
        doctor: doctor._id,
        severity: 'critical',
        $or: [{ worker: { $exists: true } }, { patient: { $exists: true } }]
      })).length;
  
      const alerts = [];
      if (pendingReportsCount > 0) {
          alerts.push({ type: 'info', message: `You have ${pendingReportsCount} pending reports to review.` });
      }
      if (criticalCases > 0) {
          alerts.push({ type: 'urgent', message: `There are ${criticalCases} critical cases that require your attention.` });
      }
  
      const dashboardData = {
        title: 'Doctor Dashboard',
        subtitle: 'Manage patient care and health assessments',
        stats: [
          { label: 'Active Patients', value: activePatientsCount, color: 'blue', icon: 'Users' },
          { label: "Today's Appointments", value: todaysAppointmentsCount, color: 'green', icon: 'Calendar' },
          { label: 'Pending Reports', value: pendingReportsCount, color: 'orange', icon: 'FileText' },
          { label: 'Critical Cases', value: criticalCases, color: 'red', icon: 'AlertTriangle' }
        ],
        cards: [
          { icon: 'Users', title: 'My Patients', path: '/patients', color: 'blue' },
          { icon: 'Stethoscope', title: 'Health Checkups', path: '/health-checkups', color: 'green' },
          { icon: 'FileText', title: 'Medical Reports', path: '/reports', color: 'purple' },
          { icon: 'Shield', title: 'Severity Assessment', path: '/severity-assessment', color: 'red' }
        ],
        alerts: alerts,
      };
      res.json(dashboardData);
    } catch (err) {
      console.error(`Error in getDoctorDashboard: ${err.message}`);
      res.status(500).send('Server Error');
    }
  };
  
  export const getEmployerDashboard = async (req, res) => {
      try {
        const employer = await Employer.findOne({ user: req.user.id }).lean();
        if (!employer) {
          return res.status(404).json({ msg: 'Employer profile not found' });
        }
    
        const workers = await Worker.find({ employerName: employer.companyName }).lean();
        const workerIds = workers.map(worker => worker._id);
    
        const totalWorkers = workers.length;
    
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
        const healthCompliantWorkers = (await HealthRecord.find({ worker: { $in: workerIds }, date: { $gte: oneYearAgo } })).length;
        const pendingCheckups = totalWorkers - healthCompliantWorkers;
        const healthIncidents = (await HealthRecord.find({ worker: { $in: workerIds }, severity: { $in: ['critical', 'high'] } })).length;
  
        const alerts = [];
          if (pendingCheckups > 0) {
              alerts.push({ type: 'warning', message: `You have ${pendingCheckups} workers with pending health checkups.` });
          }
          if (healthIncidents > 0) {
              alerts.push({ type: 'urgent', message: `There have been ${healthIncidents} recent health incidents.` });
          }
  
        const dashboardData = {
          title: 'Employer Dashboard',
          subtitle: 'Monitor worker health and ensure compliance',
          stats: [
            { label: 'Total Workers', value: totalWorkers, color: 'blue', icon: 'Users' },
            { label: 'Health Compliant', value: healthCompliantWorkers, color: 'green', icon: 'CheckCircle' },
            { label: 'Pending Checkups', value: pendingCheckups, color: 'orange', icon: 'Clock' },
            { label: 'Health Incidents', value: healthIncidents, color: 'red', icon: 'AlertTriangle' }
          ],
          cards: [
              { icon: 'Users', title: 'My Workers', path: '/workers', color: 'blue' },
              { icon: 'Shield', title: 'Health Compliance', path: '/health-compliance', color: 'green' },
              { icon: 'FileText', title: 'Reports', path: '/reports', color: 'purple' },
              { icon: 'Bell', title: 'Health Alerts', path: '/notifications', color: 'yellow' }
          ],
          alerts: alerts,
        };
        res.json(dashboardData);
      } catch (err) {
          console.error(`Error in getEmployerDashboard: ${err.message}`);
          res.status(500).send('Server Error');
      }
    };
    
    export const getAdminDashboard = async (req, res) => {
      try {
        const totalWorkers = (await Worker.find()).length;
        const activeDoctors = (await Doctor.find()).length;
        const totalEmployers = (await Employer.find()).length;
        const totalPatients = (await Patient.find()).length;
        const criticalCases = (await HealthRecord.find({ severity: 'critical' })).length;
    
        const dashboardData = {
          title: 'Admin Dashboard',
          subtitle: 'System oversight and health monitoring',
          stats: [
            { label: 'Total Workers', value: totalWorkers, color: 'blue', icon: 'Users' },
            { label: 'Active Doctors', value: activeDoctors, color: 'green', icon: 'Stethoscope' },
            { label: 'Employers', value: totalEmployers, color: 'purple', icon: 'Shield' },
            { label: 'Total Patients', value: totalPatients, color: 'orange', icon: 'User' },
            { label: 'Critical Cases', value: criticalCases, color: 'red', icon: 'AlertTriangle' }
          ],
          cards: [
            { icon: 'Users', title: 'Patient Management', path: '/admin/patients', description: 'View and manage all patients and workers', color: 'blue' },
          ],
          alerts: [],
        };
        res.json(dashboardData);

      } catch (err) {
          console.error(`Error in getAdminDashboard: ${err.message}`);
          res.status(500).send('Server Error');
      }
    };