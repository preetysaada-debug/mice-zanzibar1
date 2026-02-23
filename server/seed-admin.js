const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mice_zanzibar",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const seedAdmin = async () => {
  try {
    const email = "admin@example.com";
    const password = "admin123";
    const username = "admin";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    const query = "INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)";
    
    pool.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log("✅ Admin user already exists");
        } else {
          console.error("❌ Error creating admin user:", err.message);
        }
      } else {
        console.log("✅ Admin user created successfully!");
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
      }
      
      pool.end();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    pool.end();
    process.exit(1);
  }
};

console.log("🔧 Seeding admin user...");
seedAdmin();
