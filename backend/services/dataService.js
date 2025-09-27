
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import HealthRecord from '../models/HealthRecord.js';
import Worker from '../models/Worker.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

const getRecordsForUser = async (profileId, role) => {
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Build query based on role
    let query = {};
    if (role === 'worker') {
        query = { worker: profileObjectId };
    } else if (role === 'patient') {
        query = { patient: profileObjectId };
    } else {
        throw new Error(`Invalid role: ${role}. Must be 'worker' or 'patient'`);
    }

    return await HealthRecord.find(query)
        .populate('doctor', 'firstName lastName specialization')
        .populate('worker', 'firstName lastName')
        .populate('patient', 'firstName lastName')
        .sort({ date: -1 })
        .lean();
};

const getAppointmentsForUser = async (profileId, role) => {
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Build query based on role
    let query = {};
    if (role === 'worker') {
        query = { worker: profileObjectId };
    } else if (role === 'patient') {
        query = { patient: profileObjectId };
    } else {
        throw new Error(`Invalid role: ${role}. Must be 'worker' or 'patient'`);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return await Appointment.find({
        ...query,
        status: 'scheduled',
        date: { $gte: startOfToday }
    })
        .populate('doctor', 'firstName lastName specialization')
        .populate('worker', 'firstName lastName')
        .populate('patient', 'firstName lastName')
        .sort('date time')
        .lean();
};

const getUpcomingAppointmentsForUser = async (profileId, role) => {
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Build query based on role
    let query = {};
    if (role === 'worker') {
        query = { worker: profileObjectId };
    } else if (role === 'patient') {
        query = { patient: profileObjectId };
    } else {
        throw new Error(`Invalid role: ${role}. Must be 'worker' or 'patient'`);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return await Appointment.find({
        ...query,
        status: 'scheduled',
        date: { $gte: startOfToday }
    })
        .populate('doctor', 'firstName lastName specialization')
        .lean();
};

// Get user profile with associated data
const getUserProfile = async (userId, role) => {
    try {
        let profile = null;

        if (role === 'worker') {
            profile = await Worker.findOne({ user: userId }).lean();
        } else if (role === 'patient') {
            profile = await Patient.findOne({ user: userId }).lean();
        }

        if (!profile) {
            throw new Error(`Profile not found for user ${userId} with role ${role}`);
        }

        return profile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

// Get all appointments for a user (past and future)
const getAllAppointmentsForUser = async (profileId, role) => {
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Build query based on role
    let query = {};
    if (role === 'worker') {
        query = { worker: profileObjectId };
    } else if (role === 'patient') {
        query = { patient: profileObjectId };
    } else {
        throw new Error(`Invalid role: ${role}. Must be 'worker' or 'patient'`);
    }

    return await Appointment.find(query)
        .populate('doctor', 'firstName lastName specialization')
        .populate('worker', 'firstName lastName')
        .populate('patient', 'firstName lastName')
        .sort({ date: -1, time: -1 })
        .lean();
};

// Get health records with enhanced filtering
const getFilteredRecords = async (profileId, role, filters = {}) => {
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    // Build base query based on role
    let query = {};
    if (role === 'worker') {
        query = { worker: profileObjectId };
    } else if (role === 'patient') {
        query = { patient: profileObjectId };
    } else {
        throw new Error(`Invalid role: ${role}. Must be 'worker' or 'patient'`);
    }

    // Apply additional filters
    if (filters.severity) {
        query.severity = filters.severity;
    }
    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.dateFrom) {
        query.date = { ...query.date, $gte: new Date(filters.dateFrom) };
    }
    if (filters.dateTo) {
        query.date = { ...query.date, $lte: new Date(filters.dateTo) };
    }

    return await HealthRecord.find(query)
        .populate('doctor', 'firstName lastName specialization')
        .populate('worker', 'firstName lastName')
        .populate('patient', 'firstName lastName')
        .sort({ date: -1 })
        .lean();
};

export default {
    getRecordsForUser,
    getAppointmentsForUser,
    getUpcomingAppointmentsForUser,
    getUserProfile,
    getAllAppointmentsForUser,
    getFilteredRecords,
};
