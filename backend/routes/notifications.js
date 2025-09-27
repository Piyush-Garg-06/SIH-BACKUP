import express from 'express';
import { getNotifications, deleteNotification, markNotificationAsRead } from '../controllers/notifications.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for the logged-in user
// @access  Private
router.get('/', auth, getNotifications);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', auth, deleteNotification);

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:id/read', auth, markNotificationAsRead);

export default router;