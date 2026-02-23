const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// Protected routes (require authentication)
router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

module.exports = router;
