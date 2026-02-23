const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../authSecret");
const bcrypt = require("bcryptjs");

module.exports = {
  register: (req, res) => {
    const { email, password, firstName, lastName, phone, company } = req.body;

    console.log("Register request received:", { email, firstName, lastName });

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    req.db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Database select error:", err);
        return res.status(500).json({ message: "Database error: " + err.message });
      }

      if (results.length > 0) {
        console.log("User already exists:", email);
        return res.status(409).json({ message: "Email already registered. Please login instead." });
      }

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        req.db.query(
          "INSERT INTO users (email, password, first_name, last_name, phone, company) VALUES (?, ?, ?, ?, ?, ?)",
          [email, hashedPassword, firstName || "", lastName || "", phone || "", company || ""],
          (err, results) => {
            if (err) {
              console.error("Database insert error:", err);
              return res.status(500).json({ message: "Failed to create user: " + err.message });
            }

            console.log("User registered successfully:", email);

            // Generate JWT token
            const user = {
              id: results.insertId,
              email: email
            };
            const token = jwt.sign(user, jwtSecret);

            res.status(201).json({
              message: "User registered successfully",
              token,
              user: {
                id: user.id,
                email: user.email
              }
            });
          }
        );
      } catch (hashError) {
        console.error("Password hashing error:", hashError);
        return res.status(500).json({ message: "Error processing password: " + hashError.message });
      }
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    req.db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        jwtSecret
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        }
      });
    });
  },

  getUserProfile: (req, res) => {
    const userId = req.user.id;

    req.db.query("SELECT id, email, first_name, last_name, phone, company FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User profile retrieved",
        user: results[0]
      });
    });
  },

  updateProfile: (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, phone, company } = req.body;

    req.db.query(
      "UPDATE users SET first_name = ?, last_name = ?, phone = ?, company = ? WHERE id = ?",
      [firstName, lastName, phone, company, userId],
      (err, results) => {
        if (err) {
          console.error("Update error:", err);
          return res.status(500).json({ message: "Failed to update profile" });
        }

        res.status(200).json({ message: "Profile updated successfully" });
      }
    );
  }
  ,
  logout: (req, res) => {
    // Stateless JWTs are not stored server-side by default. Client should clear tokens.
    res.json({ success: true, message: 'Logged out' });
  }
};
