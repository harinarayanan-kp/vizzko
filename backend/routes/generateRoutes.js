const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const router = express.Router();

// Middleware to authenticate and set req.user
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /api/generate
router.post('/', auth, async (req, res) => {
  const prompt = req.body.prompt || 'A red and yellow cow';
  const sampleCount = req.body.sampleCount || 1;

  const requestJson = {
    instances: [{ prompt }],
    parameters: {
      sampleCount
    }
  };

  let accessToken = '';
  try {
    const auth = new GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    const client = await auth.getClient();
    accessToken = await client.getAccessToken();
    if (typeof accessToken === 'object' && accessToken.token) {
      accessToken = accessToken.token;
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get access token' });
  }

  try {
    const response = await fetch(
      'https://us-central1-aiplatform.googleapis.com/v1/projects/vizzko/locations/us-central1/publishers/google/models/imagen-4.0-generate-preview-05-20:predict',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestJson),
      }
    );

    const apiResponse = await response.json();
    const images =
      apiResponse.predictions?.map(
        pred => pred.bytesBase64Encoded || pred.content
      ) || [];

    // Save generated images to user
    const user = await User.findById(req.user.userId);
    if (user) {
      images.forEach(img =>
        user.generatedImages.push({ image: img })
      );
      await user.save();
    }

    res.json({ images, raw: apiResponse });
  } catch (e) {
    res.status(500).json({ error: e.message, images: [] });
  }
});

module.exports = router;