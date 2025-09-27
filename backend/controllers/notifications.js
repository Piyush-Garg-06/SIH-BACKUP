import Appointment from '../models/Appointment.js';
import HealthRecord from '../models/HealthRecord.js';
import Worker from '../models/Worker.js';
import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const user = req.user;
        const notifications = [];
        let profile = null;

        if (user.role === 'worker') {
            profile = await Worker.findOne({ user: user.id }).lean();
        } else if (user.role === 'patient') {
            profile = await Patient.findOne({ user: user.id }).lean();
        }

        // Get database notifications for the user
        const dbNotifications = await Notification.find({ userId: user.id }).sort('-createdAt').limit(10);
        // Add the database notifications to the list, ensuring all fields are included
        notifications.push(...dbNotifications.map(notification => ({
            id: notification._id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            date: notification.createdAt,
            priority: notification.priority,
            read: notification.read,
            actionUrl: notification.actionUrl,
            actionText: notification.actionText,
            relatedId: notification.relatedId,
            relatedType: notification.relatedType
        })));

        if (profile) {
            // --- Notification for upcoming appointments ---
            const upcomingAppointments = await Appointment.find({
                $or: [{ worker: profile._id }, { patient: profile._id }],
                date: { $gte: new Date() }
            }).sort('date').limit(3).lean();

            for (const app of upcomingAppointments) {
                // Determine the correct action URL based on user role
                let actionUrl = '/appointments';
                if (user.role === 'doctor') {
                    actionUrl = `/doctor/appointments/${app._id}`;
                } else if (user.role === 'worker' || user.role === 'patient') {
                    actionUrl = '/appointments';
                }

                notifications.push({
                    id: `app-${app._id}`,
                    type: 'appointment',
                    title: `Upcoming: ${app.type}`,
                    message: `You have an appointment scheduled for ${new Date(app.date).toLocaleDateString()} at ${app.time}.`,
                    date: app.createdAt || app.date,
                    priority: 'high',
                    read: false, // In a real app, this status would be stored per-user.
                    actionUrl: actionUrl,
                    actionText: 'View Appointment',
                    relatedId: app._id,
                    relatedType: 'appointment'
                });
            }

            // --- Notification for new health records ---
            const newRecords = await HealthRecord.find({
                $or: [{ worker: profile._id }, { patient: profile._id }],
            }).sort('-date').limit(2).lean();

            for (const rec of newRecords) {
                notifications.push({
                    id: `rec-${rec._id}`,
                    type: 'health_alert',
                    title: `New Health Record: ${rec.diagnosis}`,
                    message: `A new health record was added on ${new Date(rec.date).toLocaleDateString()}.`,
                    date: rec.date,
                    priority: 'normal',
                    read: true,
                    actionUrl: '/health-records',
                    actionText: 'View Report'
                });
            }
        }

        // --- Generic Notification ---
        notifications.push({
            id: 'scheme-1',
            type: 'scheme',
            title: 'Government Health Scheme',
            message: 'You may be eligible for the Kerala Migrant Health Insurance Scheme. Apply now to get coverage.',
            date: new Date(),
            priority: 'normal',
            read: false,
            actionUrl: '/government-schemes',
            actionText: 'Learn More'
        });

        // Sort notifications by date, newest first
        const sortedNotifications = notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(sortedNotifications);

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
export const deleteNotification = async (req, res) => {
    try {
        const user = req.user;
        const notificationId = req.params.id;

        // Find the notification and check if it belongs to the user
        const notification = await Notification.findOne({ _id: notificationId, userId: user.id });

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        // Delete the notification
        await Notification.deleteOne({ _id: notificationId, userId: user.id });

        res.json({ msg: 'Notification removed' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Notification not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
    try {
        const user = req.user;
        const notificationId = req.params.id;

        // Find the notification and check if it belongs to the user
        const notification = await Notification.findOne({ _id: notificationId, userId: user.id });

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        // Mark as read
        notification.read = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Notification not found' });
        }
        res.status(500).send('Server Error');
    }
};