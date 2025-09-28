import asyncHandler from 'express-async-handler';
import DiseaseOutbreak from '../models/DiseaseOutbreak.js';
import Hospital from '../models/Hospital.js';
import User from '../models/User.js';
import diseaseNotificationService from '../services/diseaseNotificationService.js';

// @desc    Create a new disease outbreak report
// @route   POST /api/disease-outbreaks
// @access  Private (Doctor, Hospital Staff, Admin)
const createOutbreak = asyncHandler(async (req, res) => {
  const {
    diseaseName,
    diseaseCode,
    coordinates,
    area,
    district,
    state,
    pincode,
    hospital,
    casesReported,
    severity,
    symptoms,
    affectedAgeGroups,
    transmissionType,
    containmentMeasures,
    notes
  } = req.body;

  // Validate required fields
  if (!diseaseName || !diseaseCode || !coordinates || !area || !district || !state || !hospital || !casesReported) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Validate coordinates
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    res.status(400);
    throw new Error('Invalid coordinates format. Expected [longitude, latitude]');
  }

  // Check if hospital exists
  const hospitalExists = await Hospital.findById(hospital);
  if (!hospitalExists) {
    res.status(404);
    throw new Error('Hospital not found');
  }

  // Create outbreak
  const outbreak = new DiseaseOutbreak({
    diseaseName,
    diseaseCode,
    location: {
      type: 'Point',
      coordinates: [coordinates[0], coordinates[1]]
    },
    area,
    district,
    state,
    pincode,
    hospital,
    hospitalName: hospitalExists.name,
    reportedBy: req.user._id,
    reportedByRole: req.user.role,
    casesReported,
    severity: severity || 'moderate',
    symptoms: symptoms || [],
    affectedAgeGroups: affectedAgeGroups || [],
    transmissionType: transmissionType || 'unknown',
    containmentMeasures: containmentMeasures || [],
    notes
  });

  const createdOutbreak = await outbreak.save();
  
  // Populate related fields
  await createdOutbreak.populate('hospital', 'name');
  await createdOutbreak.populate('reportedBy', 'name email');

  // Send notifications for the outbreak
  await diseaseNotificationService.sendOutbreakNotification(createdOutbreak);

  // Create automatic alert if severity is high
  await diseaseNotificationService.createAutomaticAlert(createdOutbreak);

  res.status(201).json(createdOutbreak);
});

// @desc    Get all disease outbreaks
// @route   GET /api/disease-outbreaks
// @access  Public
const getOutbreaks = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { diseaseName: { $regex: req.query.keyword, $options: 'i' } },
          { area: { $regex: req.query.keyword, $options: 'i' } },
          { district: { $regex: req.query.keyword, $options: 'i' } },
          { state: { $regex: req.query.keyword, $options: 'i' } }
        ]
      }
    : {};

  const count = await DiseaseOutbreak.countDocuments({ ...keyword });
  const outbreaks = await DiseaseOutbreak.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })
    .populate('hospital', 'name')
    .populate('reportedBy', 'name');

  res.json({
    outbreaks,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Get outbreak by ID
// @route   GET /api/disease-outbreaks/:id
// @access  Public
const getOutbreakById = asyncHandler(async (req, res) => {
  const outbreak = await DiseaseOutbreak.findById(req.params.id)
    .populate('hospital', 'name address district state')
    .populate('reportedBy', 'name email role');

  if (outbreak) {
    res.json(outbreak);
  } else {
    res.status(404);
    throw new Error('Disease outbreak not found');
  }
});

// @desc    Update outbreak
// @route   PUT /api/disease-outbreaks/:id
// @access  Private (Doctor, Hospital Staff, Admin)
const updateOutbreak = asyncHandler(async (req, res) => {
  const outbreak = await DiseaseOutbreak.findById(req.params.id);

  if (outbreak) {
    // Only allow updates from the reporter or admin
    if (outbreak.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this outbreak');
    }

    const {
      diseaseName,
      diseaseCode,
      coordinates,
      area,
      district,
      state,
      pincode,
      hospital,
      casesReported,
      severity,
      symptoms,
      affectedAgeGroups,
      transmissionType,
      containmentMeasures,
      notes,
      outbreakStatus
    } = req.body;

    // Update fields if provided
    if (diseaseName) outbreak.diseaseName = diseaseName;
    if (diseaseCode) outbreak.diseaseCode = diseaseCode;
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      outbreak.location = {
        type: 'Point',
        coordinates: [coordinates[0], coordinates[1]]
      };
    }
    if (area) outbreak.area = area;
    if (district) outbreak.district = district;
    if (state) outbreak.state = state;
    if (pincode) outbreak.pincode = pincode;
    if (hospital) {
      const hospitalExists = await Hospital.findById(hospital);
      if (hospitalExists) {
        outbreak.hospital = hospital;
        outbreak.hospitalName = hospitalExists.name;
      }
    }
    if (casesReported) outbreak.casesReported = casesReported;
    if (severity) outbreak.severity = severity;
    if (symptoms) outbreak.symptoms = symptoms;
    if (affectedAgeGroups) outbreak.affectedAgeGroups = affectedAgeGroups;
    if (transmissionType) outbreak.transmissionType = transmissionType;
    if (containmentMeasures) outbreak.containmentMeasures = containmentMeasures;
    if (notes) outbreak.notes = notes;
    if (outbreakStatus) outbreak.outbreakStatus = outbreakStatus;

    // Update last modified timestamp
    outbreak.lastUpdated = Date.now();

    const updatedOutbreak = await outbreak.save();
    
    // Populate related fields
    await updatedOutbreak.populate('hospital', 'name');
    await updatedOutbreak.populate('reportedBy', 'name email');

    res.json(updatedOutbreak);
  } else {
    res.status(404);
    throw new Error('Disease outbreak not found');
  }
});

// @desc    Delete outbreak
// @route   DELETE /api/disease-outbreaks/:id
// @access  Private (Admin)
const deleteOutbreak = asyncHandler(async (req, res) => {
  const outbreak = await DiseaseOutbreak.findById(req.params.id);

  if (outbreak) {
    // Only admin can delete
    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete outbreak');
    }

    await outbreak.remove();
    res.json({ message: 'Disease outbreak removed' });
  } else {
    res.status(404);
    throw new Error('Disease outbreak not found');
  }
});

// @desc    Get outbreaks by location
// @route   GET /api/disease-outbreaks/location/:district/:state
// @access  Public
const getOutbreaksByLocation = asyncHandler(async (req, res) => {
  const { district, state } = req.params;
  
  const outbreaks = await DiseaseOutbreak.find({
    district: new RegExp(district, 'i'),
    state: new RegExp(state, 'i')
  })
  .sort({ createdAt: -1 })
  .populate('hospital', 'name')
  .populate('reportedBy', 'name');

  res.json(outbreaks);
});

// @desc    Get outbreaks by disease
// @route   GET /api/disease-outbreaks/disease/:diseaseName
// @access  Public
const getOutbreaksByDisease = asyncHandler(async (req, res) => {
  const { diseaseName } = req.params;
  
  const outbreaks = await DiseaseOutbreak.find({
    diseaseName: new RegExp(diseaseName, 'i')
  })
  .sort({ createdAt: -1 })
  .populate('hospital', 'name')
  .populate('reportedBy', 'name');

  res.json(outbreaks);
});

// @desc    Get recent outbreaks
// @route   GET /api/disease-outbreaks/recent
// @access  Public
const getRecentOutbreaks = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  
  const outbreaks = await DiseaseOutbreak.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('hospital', 'name')
    .populate('reportedBy', 'name');

  res.json(outbreaks);
});

// @desc    Get outbreak statistics
// @route   GET /api/disease-outbreaks/stats
// @access  Public
const getOutbreakStats = asyncHandler(async (req, res) => {
  const stats = await DiseaseOutbreak.aggregate([
    {
      $group: {
        _id: {
          diseaseName: "$diseaseName",
          severity: "$severity",
          state: "$state"
        },
        count: { $sum: "$casesReported" },
        outbreaks: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.diseaseName",
        totalCases: { $sum: "$count" },
        totalOutbreaks: { $sum: "$outbreaks" },
        severities: {
          $push: {
            severity: "$_id.severity",
            count: "$count",
            outbreaks: "$outbreaks"
          }
        },
        states: {
          $addToSet: "$_id.state"
        }
      }
    },
    {
      $sort: { totalCases: -1 }
    }
  ]);

  res.json(stats);
});

export {
  createOutbreak,
  getOutbreaks,
  getOutbreakById,
  updateOutbreak,
  deleteOutbreak,
  getOutbreaksByLocation,
  getOutbreaksByDisease,
  getRecentOutbreaks,
  getOutbreakStats
};