const User = require('../models/user');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Local registration
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      displayName
    });

    await user.save();

    // Log in the user after registration
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Error logging in after registration' });
      res.status(201).json({ message: 'Registration successful', user: { email: user.email, displayName: user.displayName } });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Local login
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Log in user
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Error logging in' });
      res.json({ message: 'Login successful', user: { email: user.email, displayName: user.displayName } });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GitHub authentication callback
exports.githubCallback = async (req, res) => {
  try {
    const { profile } = req.user;
    
    // Find or create user
    let user = await User.findOne({ githubId: profile.id });
    
    if (!user) {
      user = await User.create({
        githubId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName || profile.username
      });
    }

    // Log in user
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Error logging in with GitHub' });
      res.redirect('/');
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
};

// Get current user
exports.getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    email: req.user.email,
    displayName: req.user.displayName
  });
};