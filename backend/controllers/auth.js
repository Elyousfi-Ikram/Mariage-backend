const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    console.log('Register request body:', req.body);
    console.log('DB Connection State:', mongoose.connection.readyState); // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting

    const { email, password, name } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    res.status(201).json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.csrf = (req, res) => {
  // Dummy CSRF for frontend compatibility
  res.json({ csrfToken: 'csrf-token-placeholder' });
};
