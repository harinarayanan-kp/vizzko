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
const ordersRoutes = require("./routes/orderRoutes"); // Orders management
const designRoutes = require("./routes/designRoutes"); // Design management
const userRoutes = require("./routes/userRoutes"); // User profile route
const adminStatsRoutes = require("./routes/adminStatsRoutes"); // Admin stats
const adminUserRoutes = require("./routes/adminUserRoutes"); // Admin user management
const adminOrderRoutes = require("./routes/adminOrderRoutes"); // Admin order management
const adminSecurityRoutes = require("./routes/adminSecurityRoutes"); // Admin security routes
const adminProductRoutes = require("./routes/adminProductRoutes"); // Admin product management

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

// Admin stats routes (dashboard KPIs)
app.use("/api/admin", adminStatsRoutes);

// Admin user management routes
app.use("/api/admin", adminUserRoutes);

// Admin order management routes
app.use("/api/admin", adminOrderRoutes);

// Admin security routes
app.use("/api/admin", adminSecurityRoutes);

// Admin product management routes
app.use("/api/admin", adminProductRoutes);

// User orders route
app.use("/api/orders", ordersRoutes);

// Design management
app.use("/api/designs", designRoutes);

// User profile route
app.use("/api/user", userRoutes);

// =======================
// Start the Server
// =======================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});
