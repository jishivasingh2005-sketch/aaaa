const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const ideaRoutes = require('./routes/ideas');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ideaspace';
mongoose.set('debug', true);
mongoose.connection.on('error', err => console.error('Mongoose Background Error:', err));
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/ideas', ideaRoutes);
app.use('/api/auth', authRoutes);

// Static Frontend Serving (for Deployment)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route for frontend (Saves the single page app navigation)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
