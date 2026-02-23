# Database Setup & Startup Guide

## STEP 1: Copy .env.example to .env
```
cp server/.env.example server/.env
```
Or manually create `server/.env` with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mice_zanzibar
DB_CONNECTION_LIMIT=10
JWT_SECRET=super_secret_key_change_me_12345
JWT_EXPIRE=7d
GMAIL_USER=you@example.com
GMAIL_PASSWORD=app_specific_password
NODE_ENV=development
PORT=5000
```

## STEP 2: Ensure MySQL is Running
- Windows: Start MySQL from Services (services.msc) or use `net start MySQL80`
- Mac: `brew services start mysql` 
- Linux: `sudo service mysql start`

## STEP 3: Create Database & Tables
Open MySQL command line (mysql -u root -p) or MySQL Workbench and run:
```sql
SOURCE database/schema.sql;
```
Or paste the contents of `database/schema.sql`

## STEP 4: Create Admin User
After schema is loaded, run in MySQL:
```sql
USE mice_zanzibar;
INSERT INTO admin_users (username, email, password) 
VALUES ('admin', 'admin@example.com', '$2a$10$YIjlrDflS5LxallqKXbkOObvxq4e63Jk8W2cX.wKIW4qfQM8/rFb.');
```
(Password: `admin123`)

## STEP 5: Install Server Dependencies
```
cd server
npm install
```

## STEP 6: Start Server
```
npm run dev
```
Should see: `Server running on port 5000`

## STEP 7: In Another Terminal, Start Client
```
cd client
npm install
npm start
```
Should open http://localhost:3000 automatically

## STEP 8: Test Admin Login
- Go to http://localhost:3000/admin-login
- Email: `admin@example.com`
- Password: `admin123`
- You should be redirected to `/admin` dashboard

## Troubleshooting

### "Cannot find module" errors?
```
cd server
npm install --legacy-peer-deps
```

### "Database connection failed"?
- Check MySQL is running
- Check .env DB credentials match your MySQL setup
- Try connecting manually: `mysql -h localhost -u root -p mice_zanzibar`

### "Invalid token" or "401 Unauthorized"?
- Check JWT_SECRET is set in .env
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check browser console (F12 → Console tab) for error messages

### Still failing?
Take a screenshot of:
1. Browser console error (F12)
2. Server terminal error
3. Network tab showing failed request (F12 → Network)
And I can diagnose from there.
