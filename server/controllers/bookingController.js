const nodemailer = require("nodemailer");

// Configure Email Transporter (only if credentials are available)
let transporter = null;

if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  });
}

// Send Booking Confirmation Email
const sendBookingEmail = async (email, hotelName, guestName) => {
  // Skip email if credentials not configured
  if (!transporter) {
    console.log("⚠️ Email sending disabled (no credentials configured)");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Booking Request Received - ${hotelName}`,
      html: `
        <h2>Booking Request Confirmation</h2>
        <p>Dear ${guestName},</p>
        <p>Your booking request for <strong>${hotelName}</strong> has been received.</p>
        <p>We will review your request and contact you shortly with confirmation details.</p>
        <p>Best regards,<br>Zanzibar MICE Connect Team</p>
      `
    });
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.log("⚠️ Error sending email (non-critical):", error.message);
  }
};

// Booking Controller
exports.createBooking = async (req, res) => {
  const { hotel_id, client_name, email, event_type, guests, event_date, message, user_id } = req.body;

  // Validation
  if (!hotel_id || !client_name || !email || !event_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `INSERT INTO bookings 
    (hotel_id, client_name, email, event_type, guests, event_date, message, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  req.db.query(
    query,
    [hotel_id, client_name, email, event_type, guests, event_date, message, user_id || null],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Get hotel name for email
      req.db.query("SELECT name FROM hotels WHERE id = ?", [hotel_id], (err, hotelResult) => {
        if (!err && hotelResult.length > 0) {
          sendBookingEmail(email, hotelResult[0].name, client_name);
        }
      });

      res.status(201).json({
        success: true,
        message: "Booking request sent successfully!",
        bookingId: result.insertId
      });
    }
  );
};

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

exports.getBookingById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT b.*, h.name as hotel_name 
    FROM bookings b 
    JOIN hotels h ON b.hotel_id = h.id 
    WHERE b.id = ?`;

  req.db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({
      success: true,
      data: result[0]
    });
  });
};

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
exports.getUserBookings = (req, res) => {
  const userId = req.user.id;
  const query = `SELECT b.*, h.name as hotel_name, h.location, h.image_url
    FROM bookings b 
    JOIN hotels h ON b.hotel_id = h.id 
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC`;

  req.db.query(query, [userId], (err, result) => {
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