const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
  },
  cropType: {
    type: String,
  },
  diseaseName: {
    type: String,
    required: true,
  },
  confidence: {
    type: String,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
  },
  treatment: {
    type: String,
    required: true,
  },
  prevention: {
    type: String,
  },
  organicTreatment: {
    type: String,
  },
  fieldName: {
    type: String,
    default: 'Main Field',
  },
  isHealthy: {
    type: Boolean,
    default: false,
  },
  rawAIResponse: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Scan', scanSchema);