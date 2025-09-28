import asyncHandler from 'express-async-handler';
import DiseaseAlert from '../models/DiseaseAlert.js';
import DiseaseOutbreak from '../models/DiseaseOutbreak.js';
import User from '../models/User.js';
import { webSocketService } from '../server.js';

// @desc    Create a new disease alert
// @route   POST /api/disease-alerts
// @access  Private (Admin)
const createAlert = asyncHandler(async (req, res) => {
  const {
    outbreak,
    alertType,
    severity,
    title,
    message,
    affectedAreas,
    district,
    state,
    targetRecipients,
    expiresAt
  } = req.body;

  // Validate required fields
  if (!outbreak || !alertType || !severity || !title || !message || !district || !state) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if outbreak exists
  const outbreakExists = await DiseaseOutbreak.findById(outbreak);
  if (!outbreakExists) {
    res.status(404);
    throw new Error('Disease outbreak not found');
  }

  // Create alert
  const alert = new DiseaseAlert({
    outbreak,
    alertType,
    severity,
    title,
    message,
    affectedAreas: affectedAreas || [],
    district,
    state,
    targetRecipients: targetRecipients || [],
    createdBy: req.user._id,
    expiresAt
  });

  const createdAlert = await alert.save();
  
  // Populate related fields
  await createdAlert.populate('outbreak', 'diseaseName area district state');
  await createdAlert.populate('createdBy', 'name email');

  res.status(201).json(createdAlert);
});

// @desc    Get all disease alerts
// @route   GET /api/disease-alerts
// @access  Public
const getAlerts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;
  const severity = req.query.severity;
  const district = req.query.district;
  const state = req.query.state;
  const isResolved = req.query.isResolved;

  let query = {};

  if (severity) query.severity = severity;
  if (district) query.district = new RegExp(district, 'i');
  if (state) query.state = new RegExp(state, 'i');
  if (isResolved !== undefined) query.isResolved = isResolved === 'true';

  const count = await DiseaseAlert.countDocuments(query);
  const alerts = await DiseaseAlert.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })
    .populate('outbreak', 'diseaseName area district state')
    .populate('createdBy', 'name');

  res.json({
    alerts,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Get alert by ID
// @route   GET /api/disease-alerts/:id
// @access  Public
const getAlertById = asyncHandler(async (req, res) => {
  const alert = await DiseaseAlert.findById(req.params.id)
    .populate('outbreak', 'diseaseName area district state symptoms')
    .populate('createdBy', 'name email');

  if (alert) {
    res.json(alert);
  } else {
    res.status(404);
    throw new Error('Disease alert not found');
  }
});

// @desc    Update alert
// @route   PUT /api/disease-alerts/:id
// @access  Private (Admin)
const updateAlert = asyncHandler(async (req, res) => {
  const alert = await DiseaseAlert.findById(req.params.id);

  if (alert) {
    const {
      alertType,
      severity,
      title,
      message,
      affectedAreas,
      district,
      state,
      targetRecipients,
      expiresAt
    } = req.body;

    // Update fields if provided
    if (alertType) alert.alertType = alertType;
    if (severity) alert.severity = severity;
    if (title) alert.title = title;
    if (message) alert.message = message;
    if (affectedAreas) alert.affectedAreas = affectedAreas;
    if (district) alert.district = district;
    if (state) alert.state = state;
    if (targetRecipients) alert.targetRecipients = targetRecipients;
    if (expiresAt) alert.expiresAt = expiresAt;

    const updatedAlert = await alert.save();
    
    // Populate related fields
    await updatedAlert.populate('outbreak', 'diseaseName area district state');
    await updatedAlert.populate('createdBy', 'name email');

    res.json(updatedAlert);
  } else {
    res.status(404);
    throw new Error('Disease alert not found');
  }
});

// @desc    Delete alert
// @route   DELETE /api/disease-alerts/:id
// @access  Private (Admin)
const deleteAlert = asyncHandler(async (req, res) => {
  const alert = await DiseaseAlert.findById(req.params.id);

  if (alert) {
    await alert.remove();
    res.json({ message: 'Disease alert removed' });
  } else {
    res.status(404);
    throw new Error('Disease alert not found');
  }
});

// @desc    Mark alert as read
// @route   PUT /api/disease-alerts/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const alert = await DiseaseAlert.findById(req.params.id);

  if (alert) {
    // Check if user has already read the alert
    const existingRead = alert.sentTo.find(item => 
      item.user.toString() === req.user._id.toString()
    );

    if (existingRead) {
      existingRead.read = true;
      existingRead.readAt = Date.now();
    } else {
      alert.sentTo.push({
        user: req.user._id,
        read: true,
        readAt: Date.now()
      });
    }

    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } else {
    res.status(404);
    throw new Error('Disease alert not found');
  }
});

// @desc    Get unread alerts for current user
// @route   GET /api/disease-alerts/unread
// @access  Private
const getUnreadAlerts = asyncHandler(async (req, res) => {
  // Find alerts where the user is in the target recipients or it's for all
  const alerts = await DiseaseAlert.find({
    $and: [
      { isResolved: false },
      {
        $or: [
          { 'targetRecipients.role': 'all' },
          { 'targetRecipients.role': req.user.role },
          { 'sentTo.user': req.user._id }
        ]
      },
      {
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: { $gte: new Date() } }
        ]
      }
    ]
  })
  .sort({ createdAt: -1 })
  .populate('outbreak', 'diseaseName area district state');

  // Filter out alerts that the user has already read
  const unreadAlerts = alerts.filter(alert => {
    const userReadStatus = alert.sentTo.find(item => 
      item.user.toString() === req.user._id.toString()
    );
    return !userReadStatus || !userReadStatus.read;
  });

  res.json(unreadAlerts);
});

// @desc    Resolve alert
// @route   PUT /api/disease-alerts/:id/resolve
// @access  Private (Admin)
const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await DiseaseAlert.findById(req.params.id);

  if (alert) {
    alert.isResolved = true;
    alert.resolvedAt = Date.now();
    alert.resolutionNotes = req.body.resolutionNotes;

    const resolvedAlert = await alert.save();
    
    // Populate related fields
    await resolvedAlert.populate('outbreak', 'diseaseName area district state');
    await resolvedAlert.populate('createdBy', 'name email');

    // Notify users via WebSocket that the alert has been resolved
    if (webSocketService) {
      await webSocketService.notifyAlertResolved(resolvedAlert);
    }

    res.json(resolvedAlert);
  } else {
    res.status(404);
    throw new Error('Disease alert not found');
  }
});

export {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
  markAsRead,
  getUnreadAlerts,
  resolveAlert
};