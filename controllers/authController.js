// Import required modules
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const db = require('../config/db');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Handle user registration
exports.registerUser = async (req, res) => {
  const { name, phone, email, password, gender, location } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
  console.log(name, phone);
  try {
    // Save user to the database
    await userModel.registerUser(
      name,
      phone,
      email,
      hashedPassword,
      gender,
      location
    );

    // Retrieve newly registered user
    const user = await new Promise((resolve, reject) => {
      userModel.getUserByEmail(email, (err, user) => {
        if (err || !user) reject('User not found');
        else resolve(user);
      });
    });

    // Store user details in session
    req.session.user = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      location: user.location,
      role: user.role || 'user',
    };

    // Save session and redirect
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.redirect('/register?error=Registration failed');
  }
};

// Handle user login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  userModel.getUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.redirect('/login?error=Invalid credentials');
    }

    // Compare password with hashed password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.redirect('/login?error=Invalid credentials');
    }

    // Store user details in session
    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      phone: user.phone,
    };

    // Save session and redirect
    req.session.save((err) => {
      if (err) {
        return res.redirect('/login?error=Session not saved');
      }
      res.redirect('/');
    });
  });
};

// Handle user logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
