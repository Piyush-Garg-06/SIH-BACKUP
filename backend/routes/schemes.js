import express from 'express';
import auth from '../middleware/auth.js';
import {
  checkEligibility,
  applyForScheme,
  getSchemeInfo,
  getAllSchemes
} from '../controllers/schemeController.js';

const router = express.Router();

// @route   GET api/schemes/eligibility/:workerId
// @desc    Check eligibility for government schemes
// @access  Private
router.get('/eligibility/:workerId', auth, checkEligibility);

// @route   POST api/schemes/apply/:workerId
// @desc    Apply for a government scheme
// @access  Private
router.post('/apply/:workerId', auth, applyForScheme);

// @route   GET api/schemes/info/:schemeId
// @desc    Get information about a specific scheme
// @access  Public
router.get('/info/:schemeId', getSchemeInfo);

// @route   GET api/schemes
// @desc    Get all available schemes
// @access  Public
router.get('/', getAllSchemes);

export default router;
