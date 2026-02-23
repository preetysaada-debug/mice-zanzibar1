const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mice_zanzibar',
});

async function update() {
  try {
    const email = 'admin@example.com';
    const newPassword = 'admin123';
    const hash = await bcrypt.hash(newPassword, 10);
    pool.query('UPDATE admin_users SET password = ? WHERE email = ?', [hash, email], (err, result) => {
      if (err) {
        console.error('Error updating password:', err.message);
        process.exit(1);
      }
      if (result.affectedRows === 0) {
        // insert if not exists
        pool.query('INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)', ['admin', email, hash], (iErr, iRes) => {
          if (iErr) {
            console.error('Error inserting admin user:', iErr.message);
            process.exit(1);
          }
          console.log('Admin user inserted with new password.');
          process.exit(0);
        });
      } else {
        console.log('Admin password updated successfully.');
        process.exit(0);
      }
    });
  } catch (e) {
    console.error('Unexpected error:', e.message);
    process.exit(1);
  }
}

update();
