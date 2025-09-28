import express from 'express';
import { getHealthCard, getHealthInfoByQR, verifyHealthCard, downloadHealthCardPDF } from '../controllers/healthCardController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/health-cards/:userId
// @desc    Get health card data for a user (worker or patient)
// @access  Private
router.get('/:userId', auth, getHealthCard);

// @route   GET api/health-cards/download/:userId
// @desc    Download health card as PDF
// @access  Private
router.get('/download/:userId', auth, downloadHealthCardPDF);

// @route   POST api/health-cards/scan
// @desc    Get complete health information by scanning QR code
// @access  Public (for hospital/emergency use)
router.post('/scan', getHealthInfoByQR);

// @route   GET api/health-cards/verify/:healthId
// @desc    Verify health card and get basic info
// @access  Public
router.get('/verify/:healthId', verifyHealthCard);

export default router;