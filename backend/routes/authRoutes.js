//authRoutes.js
const express = require('express');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const router = express.Router();



// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).send({ error: 'Name, email, and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already exists' });
    }
    // Create a new user (password will be hashed automatically)
    const user = new User({ name, email, password });
    await user.save();
    console.log('User saved:', user); // Debug statement

    // Generate JWT token with email
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).send({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Signup error:', error); // Debug statement
    res.status(400).send({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email); // Debug statement
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    // Compare the password using the comparePassword method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email); // Debug statement
      return res.status(400).send({ error: 'Invalid email or password' });
    }

    // Generate JWT token with email
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.send({ token });
  } catch (error) {
    console.error('Login error:', error); // Debug statement
    res.status(500).send({ error: error.message });
  }
});

// Password Reset
router.post('/password-reset', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Input validation
    if (!email || !newPassword) {
      return res.status(400).send({ error: 'Email and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).send({ error: 'Failed to reset password' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  try {
    // Invalidate the token on the client side
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).send({ error: 'Failed to logout' });
  }
});

// Get Current User
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ error: 'Authorization token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).send({ error: 'Failed to fetch current user' });
  }
});


// Delete User
router.delete('/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


module.exports = router;