import governmentSchemeService from '../services/governmentSchemeService.js';

// Check eligibility for schemes
export const checkEligibility = async (req, res) => {
  try {
    const { workerId } = req.params;
    const eligibility = await governmentSchemeService.checkEligibility(workerId);

    res.json({
      success: true,
      data: eligibility
    });
  } catch (error) {
    console.error('Error checking scheme eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking scheme eligibility',
      error: error.message
    });
  }
};

// Apply for scheme
export const applyForScheme = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { schemeId } = req.body;

    const application = await governmentSchemeService.applyForScheme(workerId, schemeId);

    res.json({
      success: true,
      message: 'Scheme application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Error applying for scheme:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying for scheme',
      error: error.message
    });
  }
};

// Get scheme information
export const getSchemeInfo = async (req, res) => {
  try {
    const { schemeId } = req.params;
    const scheme = governmentSchemeService.getSchemeInfo(schemeId);

    res.json({
      success: true,
      data: scheme
    });
  } catch (error) {
    console.error('Error getting scheme info:', error);
    res.status(404).json({
      success: false,
      message: 'Scheme not found',
      error: error.message
    });
  }
};

// Get all schemes
export const getAllSchemes = async (req, res) => {
  try {
    const schemes = governmentSchemeService.getAllSchemes();

    res.json({
      success: true,
      data: schemes
    });
  } catch (error) {
    console.error('Error getting schemes:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting schemes',
      error: error.message
    });
  }
};
