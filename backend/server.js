const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🌶️ ChilliTrack API is running!' });
});

// Routes
const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scan');

app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});