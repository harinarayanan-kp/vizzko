// =======================
// Vizzko Backend Server
// =======================

// Import core modules and dependencies
const express = require("express"); // Web framework for Node.js
const cors = require("cors"); // Middleware for enabling CORS
const dotenv = require("dotenv"); // Loads environment variables from .env
const { MongoClient, ServerApiVersion } = require('mongodb');
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
const productRoutes = require("./routes/productRoutes"); // Product management

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// --- CORS Configuration ---
// This is where you add the CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow requests from your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed HTTP methods
    credentials: true, // Allow sending cookies/authorization headers
  })
);
// --- End CORS Configuration ---

// Parse incoming JSON requests
app.use(express.json());

// Initialize Passport for authentication (Google OAuth, etc.)
app.use(passport.initialize());

// =======================
// MongoDB Connection
// =======================

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

// =======================
// Health Check Endpoint
// =======================

app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

// =======================
// API Routes
// =======================

// // AI image generation (Google Vertex AI)
// app.use("/api/generate", generateRoutes);

app.use("/api/auth", authRoutes);

// // Google OAuth authentication
// app.use("/api/auth", googleAuthRoutes);

// // Cart management (add, get cart items)
// app.use("/api/cart", cartRoutes);

// // Admin routes
// app.use("/api/admin", adminRoutes);

// // Admin stats routes (dashboard KPIs)
// app.use("/api/admin", adminStatsRoutes);

// // Admin user management routes
// app.use("/api/admin", adminUserRoutes);

// // Admin order management routes
// app.use("/api/admin", adminOrderRoutes);

// // Admin security routes
// app.use("/api/admin", adminSecurityRoutes);

// // Admin product management routes
// app.use("/api/admin", adminProductRoutes);

// // User orders route
// app.use("/api/orders", ordersRoutes);

// // Design management
// app.use("/api/designs", designRoutes);

// // User profile route
// app.use("/api/user", userRoutes);

// // Product management routes
// app.use("/api/products", productRoutes);

// =======================
// Start the Server
// =======================

module.exports = app;

// If you still want to run it locally with app.listen() for development,
// you can do it like this, but Vercel won't use this part.
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
