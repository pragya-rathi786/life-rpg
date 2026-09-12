const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
   res.status(201).json({
  message: 'User created successfully',
  token,
  user: {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    level: newUser.level,
    xp: newUser.xp,
    currency: newUser.currency,
    attributes: newUser.attributes,
    streak: newUser.streak,
    inventory: newUser.inventory,
  },
});
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
  message: 'Login successful',
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    level: user.level,
    xp: user.xp,
    currency: user.currency,
    attributes: user.attributes,
    streak: user.streak,
    inventory: user.inventory,
  },
});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};