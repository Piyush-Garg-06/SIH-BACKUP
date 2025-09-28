import express from 'express';
import { 
  createAlert, 
  getAlerts, 
  getAlertById, 
  updateAlert, 
  deleteAlert,
  markAsRead,
  getUnreadAlerts,
  resolveAlert
} from '../controllers/diseaseAlertController.js';
import { protect, admin, doctor, hospitalStaff } from '../middleware/auth.js';

const router = express.Router();

// Public routes for getting alerts
router.route('/')
  .get(getAlerts);

router.route('/unread')
  .get(protect, getUnreadAlerts);

router.route('/:id')
  .get(getAlertById);

// Protected routes
router.route('/')
  .post(protect, admin, createAlert);

router.route('/:id')
  .put(protect, admin, updateAlert)
  .delete(protect, admin, deleteAlert);

router.route('/:id/read')
  .put(protect, markAsRead);

router.route('/:id/resolve')
  .put(protect, admin, resolveAlert);

export default router;