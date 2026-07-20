const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const multer = require('multer');
const auth = require('../middleware/auth');
const Scan = require('../models/Scan');

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY,
  timeout: 60000,
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB max
});

router.post('/analyse', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    console.log('📸 Image received:', req.file.originalname, req.file.size, 'bytes');

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    console.log('🧠 Sending to Groq AI...');

    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3.6-27b',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: 'text',
              text: `You are an expert agricultural scientist specialising in Indian crop diseases.

Analyse this image briefly, then respond with ONLY a JSON object. Keep your internal reasoning short — a few sentences at most, then output the JSON immediately. Do not write a long analysis.

Respond in this exact JSON format:

{
  "isLeaf": true,
  "cropType": "Tomato",
  "diseaseName": "Early Blight",
  "confidence": "High",
  "severity": "Medium",
  "isHealthy": false,
  "treatment": "Apply mancozeb fungicide",
  "organicTreatment": "Neem oil spray",
  "prevention": "Rotate crops annually",
  "description": "Brown spots with concentric rings"
}

If NOT a plant leaf, return: {"isLeaf": false}

Be concise. Prioritise reaching the JSON output over lengthy analysis.`,
            },
          ],
        },
      ],
      max_tokens: 3000,
    });

    console.log('✅ Groq response received!');
    const aiText = response.choices[0].message.content;
    console.log('AI Response:', aiText);

    let aiResult;
    try {
      let cleanText = aiText.replace(/<think>[\s\S]*?<\/think>/g, '');
      cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '');
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found in response');
      aiResult = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.log('❌ Parsing failed:', e.message);
      console.log('❌ Raw AI text was:', aiText);
      return res.status(500).json({ message: 'AI response parsing failed', raw: aiText });
    }

    if (!aiResult.isLeaf) {
      return res.json({
        isLeaf: false,
        message: 'No plant leaf detected. Please scan a crop leaf.',
      });
    }

    const scan = new Scan({
      userId: req.userId,
      cropType: aiResult.cropType,
      diseaseName: aiResult.diseaseName,
      confidence: aiResult.confidence,
      severity: aiResult.severity,
      treatment: aiResult.treatment,
      prevention: aiResult.prevention,
      organicTreatment: aiResult.organicTreatment,
      fieldName: req.body.fieldName || 'Main Field',
      isHealthy: aiResult.isHealthy,
      rawAIResponse: aiText,
    });

    await scan.save();
    console.log('💾 Scan saved to MongoDB!');

    res.json({
      isLeaf: true,
      scanId: scan._id,
      cropType: aiResult.cropType,
      diseaseName: aiResult.diseaseName,
      confidence: aiResult.confidence,
      severity: aiResult.severity,
      isHealthy: aiResult.isHealthy,
      treatment: aiResult.treatment,
      organicTreatment: aiResult.organicTreatment,
      prevention: aiResult.prevention,
      description: aiResult.description,
    });

  } catch (error) {
    console.error('❌ Scan error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(scans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    res.json(scan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Scan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;