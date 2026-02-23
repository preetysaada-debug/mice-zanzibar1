const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../authSecret");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = bearerHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
