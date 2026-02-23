const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware } = require("../controllers/adminController");

// Admin Authentication
router.post("/login", adminController.adminLogin);
router.post("/register", adminController.adminRegister);
router.post("/logout", adminController.adminLogout);

// Protected Routes - Require Authentication
router.post("/hotel", authMiddleware, adminController.addHotel);
router.put("/hotel/:id", authMiddleware, adminController.updateHotel);
router.delete("/hotel/:id", authMiddleware, adminController.deleteHotel);
router.get("/bookings", authMiddleware, adminController.getAllBookings);
router.put("/booking/:id/status", authMiddleware, adminController.updateBookingStatus);

module.exports = router;
