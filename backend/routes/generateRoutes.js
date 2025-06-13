const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { GoogleAuth } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");

// Middleware to authenticate and set req.user
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Helper to upload base64 image to GCS
async function uploadBase64ToGCS(base64String, filename) {
  const base64Data = base64String.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const file = bucket.file(filename);
  await file.save(buffer, { contentType: "image/png" });
  // Return only the public URL (do NOT prepend data:image/png;base64,)
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

// POST /api/generate
router.post("/", auth, async (req, res) => {
  const prompt = req.body.prompt || "A red and yellow cow";
  const sampleCount = req.body.sampleCount || 1;

  const requestJson = {
    instances: [{ prompt }],
    parameters: {
      sampleCount,
    },
  };
  let accessToken = "";
  try {
    const auth = new GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });
    const client = await auth.getClient();
    accessToken = await client.getAccessToken();
    if (typeof accessToken === "object" && accessToken.token) {
      accessToken = accessToken.token;
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to get access token" });
  }

  try {
    const response = await fetch(
      "https://us-central1-aiplatform.googleapis.com/v1/projects/vizzko/locations/us-central1/publishers/google/models/imagen-4.0-generate-preview-05-20:predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestJson),
      }
    );

    const apiResponse = await response.json();
    const images =
      apiResponse.predictions?.map(
        (pred) => pred.bytesBase64Encoded || pred.content
      ) || [];

    const imageUrls = [];
    const user = await User.findById(req.user.userId);
    for (let i = 0; i < images.length; i++) {
      const filename = `user_${
        req.user.userId || "anon"
      }_${Date.now()}_${i}.png`;
      const url = await uploadBase64ToGCS(images[i], filename);
      imageUrls.push(url);
      // Save the image URL to the user's generatedImages list
      if (user) {
        if (!user.generatedImages) user.generatedImages = [];
        user.generatedImages.push({ imageUrl: url });
      }
    }
    if (user) await user.save();

    res.json({ images: imageUrls, raw: apiResponse });
  } catch (e) {
    res.status(500).json({ error: e.message, images: [] });
  }
});

module.exports = router;
