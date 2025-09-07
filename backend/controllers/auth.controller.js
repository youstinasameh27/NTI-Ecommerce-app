const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'missing fields' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role: 'user' });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.login = exports.loginUser;

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'not found' });
    return res.status(200).json({ message: 'me', data: user });
  } catch (e) {
    return res.status(500).json({ message: 'server error', error: e.message });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.status(200).json({ message: 'logged out' });
  } catch (e) {
    return res.status(500).json({ message: 'server error', error: e.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
 
    const { name, phone, address, password, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'not found' });

   
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists && String(exists._id) !== String(user._id)) {
        return res.status(400).json({ message: 'email already in use' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const clean = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    };

    return res.status(200).json({ message: 'updated', data: clean });
  } catch (e) {
    return res.status(500).json({ message: 'server error', error: e.message });
  }
};
