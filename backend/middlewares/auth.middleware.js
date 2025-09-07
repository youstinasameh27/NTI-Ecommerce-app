const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const getToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) return req.headers.authorization.split(' ')[1];
  if (req.cookies && req.cookies.token) return req.cookies.token;
  if (req.body && req.body.token) return req.body.token;
  return null;
};

exports.protect = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    req.user = { _id: user._id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') 
    return next();
  return res.status(403).json({ message: 'Admin access only' });

};

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Missing token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret'); // adapt as used
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    console.error('isAuth error', err);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

exports.authenticate = exports.protect;
