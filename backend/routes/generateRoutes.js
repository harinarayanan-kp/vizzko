const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { GoogleAuth } = require("google-auth-library");
const { Storage } = require("@google-cloud/storage");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
const { getTshirtPromptData } = require("../utils/geminiPrompt");

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

// Google Cloud Storage setup
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

/**
 * Uploads a base64 encoded image to Google Cloud Storage and returns its public URL.
 * @param {string} base64String - The base64 encoded image string.
 * @param {string} filename - The desired filename for the image in GCS.
 * @returns {Promise<string>} A promise that resolves with the public URL of the uploaded image.
 */
async function uploadBase64ToGCS(base64String, filename) {
  const base64Data = base64String.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const file = bucket.file(filename);
  await file.save(buffer, { contentType: "image/png" });
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

// POST /api/generate
router.post("/", auth, async (req, res) => {
  const userPrompt = req.body.prompt || "A red and yellow cow";
  let geminiData;
  try {
    geminiData = await getTshirtPromptData(userPrompt);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Gemini prompt failed", details: err.message });
  }

  const { color, frontImageURL, backImageURL } = geminiData;
  const prompts = [frontImageURL, backImageURL];
  const aspectRatios = ["1:1", "4:3"];

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

  const imageUrls = [];
  const user = await User.findById(req.user.userId);
  if (user && !user.generatedImages) user.generatedImages = [];

  for (let i = 0; i < prompts.length; i++) {
    if (!prompts[i]) {
      imageUrls.push("");
      continue;
    }
    const requestJson = {
      instances: [{ prompt: prompts[i], aspectRatio: aspectRatios[i] }],
      parameters: { sampleCount: 1 },
    };
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
      let url = "";
      if (images[0]) {
        const filename = `user_${
          req.user.userId || "anon"
        }_${Date.now()}_${i}.png`;
        url = await uploadBase64ToGCS(images[0], filename);
      }
      imageUrls.push(url);
    } catch (e) {
      imageUrls.push("");
    }
  }

  // Save to user
  if (user) {
    user.generatedImages.push({
      color,
      frontPrompt: frontImageURL,
      backPrompt: backImageURL,
      frontImageUrl: imageUrls[0],
      backImageUrl: imageUrls[1],
      createdAt: new Date(),
    });
    await user.save();
  }

  res.json({
    color,
    frontPrompt: frontImageURL,
    backPrompt: backImageURL,
    frontImageUrl: imageUrls[0],
    backImageUrl: imageUrls[1],
  });
});

module.exports = router;
