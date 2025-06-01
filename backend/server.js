// =======================
// Vizzko Backend Server
// =======================

// Import core modules and dependencies
const express = require("express"); // Web framework for Node.js
const cors = require("cors"); // Middleware for enabling CORS
const dotenv = require("dotenv"); // Loads environment variables from .env
const mongoose = require("mongoose"); // MongoDB object modeling tool
const passport = require("passport"); // Authentication middleware

// Import route handlers
const authRoutes = require("./routes/authRoutes"); // Email/password auth
const generateRoutes = require("./routes/generateRoutes"); // AI image generation
const googleAuthRoutes = require("./routes/googleAuth"); // Google OAuth
const cartRoutes = require("./routes/cartRoutes"); // Cart management
const adminRoutes = require("./routes/adminRoutes"); // Admin routes

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS for all routes (allows frontend to access backend)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Initialize Passport for authentication (Google OAuth, etc.)
app.use(passport.initialize());

// =======================
// MongoDB Connection
// =======================

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

// =======================
// Health Check Endpoint
// =======================

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// =======================
// API Routes
// =======================

// AI image generation (Google Vertex AI)
app.use("/api/generate", generateRoutes);

// User authentication (signup, login, etc.)
app.use("/api/auth", authRoutes);

// Google OAuth authentication
app.use("/api/auth", googleAuthRoutes);

// Cart management (add, get cart items)
app.use("/api/cart", cartRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// =======================
// Start the Server
// =======================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});
