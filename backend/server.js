// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const path = require("path");
const passport = require('passport');

const authRoutes = require('./routes/authRoutes');
const generateRoutes = require('./routes/generateRoutes');
const googleAuthRoutes = require('./routes/googleAuth');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Serve static files from the 'uploads' directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// Routes
app.use("/api/generate", generateRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/auth', googleAuthRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/user', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});
