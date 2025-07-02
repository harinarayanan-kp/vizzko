const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Middleware to check admin (simple JWT check)
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.admin) {
      req.admin = decoded;
      return next();
    }
    return res.status(403).json({ error: "Forbidden" });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Utility: Write to audit log
function logAdminAction(action, req) {
  const logPath = path.join(__dirname, "../admin_audit.log");
  const entry = `${new Date().toISOString()} | ${
    req.admin?.email || "admin"
  } | ${action}\n`;
  fs.appendFile(logPath, entry, (err) => {
    if (err) console.error("Audit log error:", err);
  });
}

// PATCH /api/admin/password - Change admin password
router.patch("/password", adminAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res
        .status(400)
        .json({ error: "Both old and new password required" });
    if (oldPassword !== process.env.ADMIN_PASSWORD)
      return res.status(403).json({ error: "Old password incorrect" });
    // Change in-memory and .env (if possible)
    process.env.ADMIN_PASSWORD = newPassword;
    // Optionally update .env file
    try {
      const envPath = path.join(__dirname, "../.env");
      let env = fs.readFileSync(envPath, "utf-8");
      env = env.replace(/ADMIN_PASSWORD=.*/g, `ADMIN_PASSWORD=${newPassword}`);
      fs.writeFileSync(envPath, env);
    } catch (e) {
      /* ignore if .env not writable */
    }
    logAdminAction("Changed admin password", req);
    res.json({ message: "Admin password changed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/audit-log - Get audit log (last 100 lines)
router.get("/audit-log", adminAuth, (req, res) => {
  try {
    const logPath = path.join(__dirname, "../admin_audit.log");
    if (!fs.existsSync(logPath)) return res.json({ log: [] });
    const lines = fs.readFileSync(logPath, "utf-8").trim().split("\n");
    res.json({ log: lines.slice(-100).reverse() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: wrap all admin actions for audit
router.use((req, res, next) => {
  // Only log mutating actions
  if (["POST", "PATCH", "DELETE"].includes(req.method)) {
    logAdminAction(`${req.method} ${req.originalUrl}`, req);
  }
  next();
});

module.exports = router;
