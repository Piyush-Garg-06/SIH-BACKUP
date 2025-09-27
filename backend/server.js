import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import fs from 'fs';
import path from 'path';

dotenv.config({ path: './.env' });

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Connect Database
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://192.168.1.68:5174' // Network IP for mobile access
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Init Middleware
app.use(express.json({ extended: false, limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
import authRoutes from './routes/auth.js';
import dbRoutes from './routes/db.js';
import healthRecordRoutes from './routes/healthRecord.js';
import healthCardRoutes from './routes/healthCard.js';
import schemeRoutes from './routes/schemes.js';
import dashboardRoutes from './routes/dashboard.js';
import doctorsRoutes from './routes/doctors.js';
import appointmentsRoutes from './routes/appointments.js';
import usersRoutes from './routes/users.js';
import employersRoutes from './routes/employers.js'; // Import employers routes
import workersRoutes from './routes/workers.js'; // Import workers routes
import patientsRoutes from './routes/patients.js'; // Import patients routes
import notificationsRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js'; // Import admin routes
import emitraRoutes from './routes/emitra.js'; // Import emitra routes
import hospitalsRoutes from './routes/hospitals.js'; // Import hospitals routes

app.use('/api/auth', authRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/health-cards', healthCardRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/employers', employersRoutes); // Use employers routes
app.use('/api/workers', workersRoutes); // Use workers routes
app.use('/api/patients', patientsRoutes); // Use patients routes
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes); // Use admin routes
app.use('/api/emitra', emitraRoutes); // Use emitra routes
app.use('/api/hospitals', hospitalsRoutes); // Use hospitals routes

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Server accessible at:`);
  console.log(`  Local: http://localhost:${PORT}`);
  console.log(`  Network: http://192.168.1.68:${PORT}`);
});

export { app, server };