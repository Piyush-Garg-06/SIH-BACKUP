import Worker from '../models/Worker.js';
import Patient from '../models/Patient.js'; // Import Patient model
import notificationService from './notificationService.js';

class HealthCardService {
  // Generate unique health ID
  generateHealthId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `HLTH${timestamp.slice(-6)}${random}`;
  }

  // Generate health card for a worker (this function might need to be generalized later)
  async generateHealthCard(profileId, role) {
    try {
      let profile;
      if (role === 'worker') {
        profile = await Worker.findById(profileId).populate('user', 'email');
      } else if (role === 'patient') {
        profile = await Patient.findById(profileId).populate('user', 'email');
      }

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Generate unique health ID if not exists
      if (!profile.healthId) {
        profile.healthId = this.generateHealthId();
        await profile.save();
      }

      // Create health card data
      const healthCardData = {
        healthId: profile.healthId,
        name: `${profile.firstName} ${profile.lastName}`,
        dateOfBirth: profile.dob,
        bloodGroup: profile.bloodGroup,
        mobile: profile.mobile,
        email: profile.user.email,
        address: profile.address,
        district: profile.district,
        nativeState: profile.nativeState,
        photo: profile.photo,
        emergencyContact: profile.employerContact || profile.mobile, // Use employerContact for worker, mobile for patient
        issueDate: new Date(),
        validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
        qrCode: this.generateQRCodeData(profile.healthId)
      };

      // Send notification about health card generation
      if (profile.user) {
        const emailContent = this.getHealthCardEmailContent(profile, healthCardData);
        await notificationService.sendEmail(
          profile.user.email,
          'Health Card Generated',
          emailContent
        );
      }

      return healthCardData;
    } catch (error) {
      console.error(`Error generating health card for profile ${profileId}:`, error);
      throw new Error('Could not generate health card. Please try again later.');
    }
  }

  getHealthCardEmailContent(profile, healthCardData) {
    return `
      <h3>Health Card Generated Successfully</h3>
      <p>Dear ${profile.firstName},</p>
      <p>Your digital health card has been generated successfully.</p>
      <p><strong>Health ID:</strong> ${profile.healthId}</p>
      <p><strong>Valid Till:</strong> ${healthCardData.validTill.toDateString()}</p>
      <p>You can now use this health card at any registered hospital or clinic.</p>
      <p>Best regards,<br>Digital Health Record Management System</p>
    `;
  }

  // Generate QR code data for health card
  generateQRCodeData(healthId) {
    return JSON.stringify({
      healthId,
      type: 'health_card',
      issuedBy: 'Digital Health Record Management System',
      timestamp: Date.now()
    });
  }

  // Get profile (Worker or Patient) by health ID
  async getProfileByHealthId(healthId) {
    try {
      let profile = await Worker.findOne({ healthId }).populate('user', 'email');
      if (profile) {
        return { profile, role: 'worker' };
      }

      profile = await Patient.findOne({ healthId }).populate('user', 'email');
      if (profile) {
        return { profile, role: 'patient' };
      }

      return null;
    } catch (error) {
      console.error(`Error getting profile by health ID ${healthId}:`, error);
      throw new Error('Could not retrieve profile details. Please try again later.');
    }
  }

  // Verify health card
  async verifyHealthCard(healthId) {
    try {
      const result = await this.getProfileByHealthId(healthId);

      if (!result) {
        return { valid: false, message: 'Invalid health card' };
      }

      const { profile, role } = result;

      return {
        valid: true,
        profile: {
          healthId: profile.healthId,
          name: `${profile.firstName} ${profile.lastName}`,
          dateOfBirth: profile.dob,
          bloodGroup: profile.bloodGroup,
          mobile: profile.mobile,
          address: profile.address,
          district: profile.district,
          role: role
        }
      };
    } catch (error) {
      console.error(`Error verifying health card with ID ${healthId}:`, error);
      return { valid: false, message: 'Error verifying health card. Please try again later.' };
    }
  }
}

export default new HealthCardService();