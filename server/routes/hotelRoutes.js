const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");

// GET all hotels
router.get("/", hotelController.getAllHotels);

// GET single hotel by ID
router.get("/:id", hotelController.getHotelById);

module.exports = router;
