const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const helmet = require("helmet");
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Basic security + middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      // allow dev frontend and backend connections during development
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5000", "ws://localhost:3000"],
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter: keep conservative limits in production, but skip/relax in development
const rateWindow = parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000), 10);
const rateMax = parseInt(process.env.RATE_LIMIT_MAX || '200', 10);

const limiter = rateLimit({
  windowMs: rateWindow,
  max: rateMax,
  standardHeaders: true,
  legacyHeaders: false,
  // Skip limiter in development or for localhost/internal requests to avoid blocking dev workflow
  skip: (req, res) => {
    if (process.env.NODE_ENV !== 'production') return true;
    const ip = (req.ip || '').replace('::ffff:', '');
    if (ip === '127.0.0.1' || ip === '::1' || req.hostname === 'localhost') return true;
    return false;
  }
});
app.use(limiter);

// Database Pool (safer for concurrent requests)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mice_zanzibar",
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10", 10),
  queueLimit: 0
});

// Make db accessible to routes (use callback-style pool so existing controllers remain compatible)
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes (API only - React handles all frontend)

app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Serve React production build if present; otherwise in development proxy to CRA dev server
const buildIndex = path.join(__dirname, '..', 'client', 'build', 'index.html');

// Always serve public folder (images, etc.) directly from backend
app.use('/images', express.static(path.join(__dirname, '..', 'client', 'public', 'images')));
app.use(express.static(path.join(__dirname, 'public')));

if (fs.existsSync(buildIndex)) {
  // Production: serve built React app
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
} else if (process.env.NODE_ENV !== 'production') {
  // Development: proxy non-API, non-static requests to React dev server
  const filter = (pathname, req) => {
    // Only proxy if: NOT /api/*, NOT /images/*, NOT file extensions (like .js, .css, .json)
    if (pathname.startsWith('/api/') || pathname.startsWith('/images/')) return false;
    if (/\.\w+$/.test(pathname)) return false; // has file extension
    return true;
  };
  app.use(createProxyMiddleware(filter, {
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true,
    logLevel: 'warn'
  }));
}

// Fallback handler: if request reaches here and is API, return 404; otherwise try to serve index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  if (fs.existsSync(buildIndex)) {
    return res.sendFile(buildIndex);
  }
  // No build and not proxied (e.g., production without build) — diagnostic JSON
  res.status(200).json({
    message: 'Backend API Server Running',
    note: 'Build not found. During development use http://localhost:3000 for the admin dashboard',
    available_endpoints: [
      'GET /api/health',
      'GET /api/hotels',
      'POST /api/admin/login',
      'POST /api/admin/register'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  console.error("Stack:", err.stack);
  console.error("Path:", req.path);
  console.error("Method:", req.method);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? err.message : "An error occurred"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
