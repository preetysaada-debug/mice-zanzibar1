const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../authSecret");
const bcrypt = require("bcryptjs");

// Authentication Middleware
exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Admin Register
exports.adminRegister = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Normalize email: trim and lowercase
    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    // Use email as username if username not provided
    const query = "INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)";

    req.db.query(query, [normalizedEmail, normalizedEmail, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: err.message });
      }

      // Generate token for auto-login
      const token = jwt.sign(
        { id: result.insertId, email: normalizedEmail },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
      );

      res.status(201).json({
        success: true,
        message: "Registration successful!",
        token: token
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // Normalize email: trim and lowercase
  const normalizedEmail = email.trim().toLowerCase();
  const query = "SELECT * FROM admin_users WHERE email = ?";

  req.db.query(query, [normalizedEmail], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = result[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: { id: admin.id, username: admin.username, email: admin.email }
    });
  });
};

// Admin logout endpoint (client can call this to signal logout)
exports.adminLogout = (req, res) => {
  // With stateless JWTs there's nothing to revoke here unless a blacklist is implemented.
  // We provide a friendly endpoint so the client can call it before clearing local storage.
  res.json({ success: true, message: 'Logged out' });
};

// Add Hotel
exports.addHotel = (req, res) => {
  const { name, location, capacity, price_range, description, image_url, email } = req.body;

  if (!name || !location || !capacity) {
    return res.status(400).json({ error: "Name, location, and capacity are required" });
  }

  const query = `INSERT INTO hotels 
    (name, location, capacity, price_range, description, image_url, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  req.db.query(
    query,
    [name, location, capacity, price_range, description, image_url, email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        success: true,
        message: "Hotel added successfully",
        hotelId: result.insertId
      });
    }
  );
};

// Update Hotel
exports.updateHotel = (req, res) => {
  const { id } = req.params;
  const { name, location, capacity, price_range, description, image_url, email } = req.body;

  const query = `UPDATE hotels 
    SET name = ?, location = ?, capacity = ?, price_range = ?, description = ?, image_url = ?, email = ? 
    WHERE id = ?`;

  req.db.query(
    query,
    [name, location, capacity, price_range, description, image_url, email, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      res.json({
        success: true,
        message: "Hotel updated successfully"
      });
    }
  );
};

// Delete Hotel
exports.deleteHotel = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM hotels WHERE id = ?";

  req.db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json({
      success: true,
      message: "Hotel deleted successfully"
    });
  });
};

// Get All Bookings (Admin)
exports.getAllBookings = (req, res) => {
  const query = `SELECT b.*, h.name as hotel_name 
    FROM bookings b 
    JOIN hotels h ON b.hotel_id = h.id 
    ORDER BY b.created_at DESC`;

  req.db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      success: true,
      data: result,
      count: result.length
    });
  });
};

// Update Booking Status (Admin)
exports.updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "confirmed", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const query = "UPDATE bookings SET status = ? WHERE id = ?";

  req.db.query(query, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      success: true,
      message: `Booking status updated to ${status}`
    });
  });
};
