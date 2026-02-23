const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// POST create booking
router.post("/", bookingController.createBooking);

// GET all bookings (with optional filters)
router.get("/", bookingController.getAllBookings);

// GET user's own bookings (protected)
router.get("/my-bookings/list", authMiddleware, bookingController.getUserBookings);

// GET single booking by ID
router.get("/:id", bookingController.getBookingById);

// PUT update booking status
router.put("/:id", bookingController.updateBookingStatus);

module.exports = router;
