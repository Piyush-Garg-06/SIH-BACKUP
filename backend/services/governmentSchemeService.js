import Worker from '../models/Worker.js';
import notificationService from './notificationService.js';

class GovernmentSchemeService {
  constructor() {
    this.schemes = this.getSchemes();
  }

  getSchemes() {
    // Kerala government health schemes
    return {
      'karunya_beneficiary': {
        name: 'Karunya Health Scheme',
        description: 'Free medical treatment for poor families',
        eligibility: 'Annual income less than ₹3,00,000',
        benefits: 'Free treatment up to ₹5,00,000 per year'
      },
      'medisep': {
        name: 'Medical Insurance for State Employees and Pensioners',
        description: 'Medical insurance for government employees',
        eligibility: 'Government employees and pensioners',
        benefits: 'Cashless treatment up to ₹3,00,000 per year'
      },
      'snehasanthwanam': {
        name: 'Snehasanthwanam Scheme',
        description: 'Free treatment for bedridden patients',
        eligibility: 'Bedridden patients certified by medical board',
        benefits: 'Free nursing care and medical treatment'
      },
      'ksby': {
        name: 'Kerala Sahayahastham Beneficiary Yojana',
        description: 'Financial assistance for medical treatment',
        eligibility: 'Families with annual income less than ₹1,00,000',
        benefits: 'Financial assistance up to ₹50,000 per year'
      }
    };
  }

  // Check eligibility for schemes
  async checkEligibility(workerId) {
    try {
      const worker = await Worker.findById(workerId);

      if (!worker) {
        throw new Error('Worker not found');
      }

      const eligibleSchemes = [];
      const annualIncome = this.calculateAnnualIncome(worker);

      for (const [schemeId, scheme] of Object.entries(this.schemes)) {
        if (this.isEligibleForScheme(worker, scheme, annualIncome)) {
          eligibleSchemes.push({
            schemeId,
            ...scheme
          });
        }
      }

      return {
        worker: {
          name: `${worker.firstName} ${worker.lastName}`,
          annualIncome,
          district: worker.district
        },
        eligibleSchemes,
        totalEligible: eligibleSchemes.length
      };
    } catch (error) {
      console.error('Error checking scheme eligibility:', error);
      throw error;
    }
  }

  // Calculate annual income based on employment type
  // TODO: Replace this with a more accurate income calculation based on actual income data
  calculateAnnualIncome(worker) {
    const baseIncome = {
      'daily_wage': 15000, // ₹500/day * 30 days
      'monthly': 25000,    // Average monthly wage
      'contract': 30000,   // Contract worker average
      'permanent': 35000   // Permanent worker average
    };

    return baseIncome[worker.employmentType] || 20000;
  }

  // Check if worker is eligible for a specific scheme
  isEligibleForScheme(worker, scheme, annualIncome) {
    switch (scheme.name) {
      case 'Karunya Health Scheme':
        return annualIncome < 300000 && worker.nativeState === 'Kerala';

      case 'Medical Insurance for State Employees and Pensioners':
        return worker.employmentType === 'government' || worker.employmentType === 'pensioner';

      case 'Snehasanthwanam Scheme':
        return worker.disabilities !== 'no' || worker.chronicConditions.length > 0;

      case 'Kerala Sahayahastham Beneficiary Yojana':
        return annualIncome < 100000;

      default:
        return false;
    }
  }

  // Apply for scheme benefits
  async applyForScheme(workerId, schemeId) {
    try {
      const worker = await Worker.findById(workerId);

      if (!worker) {
        throw new Error('Worker not found');
      }

      const scheme = this.schemes[schemeId];
      if (!scheme) {
        throw new Error('Scheme not found');
      }

      // TODO: Save the application to the database
      const application = {
        schemeId,
        schemeName: scheme.name,
        workerId,
        workerName: `${worker.firstName} ${worker.lastName}`,
        applicationDate: new Date(),
        status: 'pending',
        applicationId: this.generateApplicationId()
      };

      // Send notification about scheme application
      if (worker.user) {
        const emailContent = this.getSchemeApplicationEmailContent(worker, scheme, application);
        await notificationService.sendEmail(
          worker.user.email,
          'Scheme Application Submitted',
          emailContent
        );
      }

      return application;
    } catch (error) {
      console.error('Error applying for scheme:', error);
      throw error;
    }
  }

  getSchemeApplicationEmailContent(worker, scheme, application) {
    return `
      <h3>Scheme Application Submitted</h3>
      <p>Dear ${worker.firstName},</p>
      <p>Your application for <strong>${scheme.name}</strong> has been submitted successfully.</p>
      <p><strong>Application ID:</strong> ${application.applicationId}</p>
      <p><strong>Scheme Benefits:</strong> ${scheme.benefits}</p>
      <p>You will be notified once your application is processed.</p>
      <p>Best regards,<br>Digital Health Record Management System</p>
    `;
  }

  // Generate unique application ID
  generateApplicationId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `APP${timestamp.slice(-8)}${random}`;
  }

  // Get scheme information
  getSchemeInfo(schemeId) {
    const scheme = this.schemes[schemeId];
    if (!scheme) {
      throw new Error('Scheme not found');
    }
    return scheme;
  }

  // Get all available schemes
  getAllSchemes() {
    return Object.entries(this.schemes).map(([id, scheme]) => ({
      schemeId: id,
      ...scheme
    }));
  }
}

export default new GovernmentSchemeService();
