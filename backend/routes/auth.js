const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'auth/email-already-in-use' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'auth/weak-password' });

    user = new User({
      uid: 'email-' + Date.now(),
      displayName: name || email.split('@')[0],
      email,
      password // Plain for simple mock, typically bcrypt
    });

    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: 'auth/wrong-password' });
    
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  const { email, displayName, photoURL, uid } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ uid, email, displayName, photoURL });
      await user.save();
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/auth/profile
router.put('/profile', async (req, res) => {
  const { uid, displayName, photoURL } = req.body;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.displayName = displayName;
    if (photoURL !== undefined) user.photoURL = photoURL;
    
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/auth/users/count
router.get('/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/auth/users (Admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/auth/users/:uid (Admin only)
router.delete('/users/:uid', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ uid: req.params.uid });
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
