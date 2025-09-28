import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Role-based middleware functions
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
};

const doctor = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Doctors only.' });
  }
};

const hospitalStaff = (req, res, next) => {
  if (req.user && req.user.role === 'hospital_staff') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Hospital staff only.' });
  }
};

export { auth as protect, admin, doctor, hospitalStaff };
export default auth;