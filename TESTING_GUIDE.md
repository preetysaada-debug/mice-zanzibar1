# Quick Start Testing Guide

## Prerequisites
1. MySQL running (XAMPP or other)
2. Database created with schema: `database/schema.sql`
3. Backend dependencies installed: `npm install` in `/server`
4. Frontend dependencies installed: `npm install` in `/client`

## Testing the Admin Dashboard

### 1. Start Backend Server
```bash
cd server
npm start
```
Expected output:
```
MySQL Connected successfully
Server running on port 5000
```

### 2. Test Server Health
Open browser and visit:
```
http://localhost:5000/api/health
```
Expected: `{ "message": "Server is running" }`

### 3. Access Admin Dashboard
Open browser and visit:
```
http://localhost:5000/admin
```
Expected: Login page with email/password fields

### 4. Create Admin Account (First Time)
1. Click "Register here"
2. Enter test email: `admin@zanzibar.com`
3. Enter test password: `Admin123!`
4. Click "Register"
5. Expected: You are logged in to dashboard

### 5. Test Hotels Management

#### Add a Hotel
1. Click "Hotels" tab (should already be active)
2. Click "+ Add New Hotel" button
3. Fill in form:
   ```
   Hotel Name: Zanzibar Palace
   Location: Stone Town
   Capacity: 200
   Price Range: $$$$
   Description: Luxury beachfront hotel with ocean views
   Image URL: https://via.placeholder.com/300x200?text=Zanzibar+Palace
   Email: info@palace.zanzibar.com
   ```
4. Click "Save Hotel"
5. Expected: Hotel appears in the grid, success message shown

#### Edit a Hotel
1. Find the hotel you just added
2. Click "✏️ Edit" button
3. Change hotel name to "Zanzibar Palace Resort"
4. Click "Save Hotel"
5. Expected: Hotel name updated in grid, success message shown

#### Delete a Hotel
1. Find any hotel
2. Click "🗑️ Delete" button
3. Confirm in dialog
4. Expected: Hotel removed from grid, success message shown

### 6. Test Bookings Management

#### Create Booking from Public Site
1. In new terminal, start React frontend:
   ```bash
   cd client
   npm start
   ```
2. Open `http://localhost:3000` in browser
3. Select a hotel and click "Book Now"
4. Fill in booking form:
   ```
   Name: John Doe
   Email: john@example.com
   Event Type: Conference
   Guests: 50
   Date: [Select future date]
   Message: Test booking
   ```
5. Click "Book Hotel"
6. Expected: Confirmation message on website

#### Confirm Booking in Admin Dashboard
1. Go back to admin dashboard: `http://localhost:5000/admin`
2. Click "Bookings" tab
3. Find the booking you just created
4. Click "✓ Confirm" button
5. Expected: Status changes to "CONFIRMED", success message shown

#### Reject Booking
1. Make another booking from public site (repeat step 4)
2. Go to admin dashboard, Bookings tab
3. Find the new booking
4. Click "✕ Reject" button
5. Expected: Status changes to "REJECTED", success message shown

### 7. Test Authentication

#### Login Again
1. Click "Logout" button
2. Expected: Redirected to login page, localStorage cleared
3. Login again with your email and password
4. Expected: Dashboard loads, you're logged in

#### Test Invalid Login
1. Enter wrong email or password
2. Click "Login"
3. Expected: Error message "Invalid email or password"

#### Register Another Admin
1. Click "Register here"
2. Enter new email: `manager@zanzibar.com`
3. Enter password: `Manager123!`
4. Click "Register"
5. Expected: Logged in as new admin

### 8. Verify Database

Check MySQL to verify data was saved:
```sql
-- Check hotels
SELECT * FROM hotels;

-- Check bookings
SELECT * FROM bookings;

-- Check admin users
SELECT id, email FROM admin_users;
```

## Expected Test Results

✅ All tests pass if you see:
- Login/Register pages load correctly
- Hotels display in grid layout
- Add/Edit/Delete hotel operations work
- Bookings appear after creation from public site
- Confirm/Reject booking changes status
- Logout clears session
- Admin accounts persist in database
- No errors in browser console
- No errors in server terminal

## Troubleshooting

### "Cannot GET /admin"
- Check `app.js` has `res.sendFile(__dirname + "/views/admin.html")`
- Check `admin.html` exists in `server/views/`
- Restart server

### "Cannot find module 'mysql2'"
- Run `npm install` in `/server` directory
- Restart server

### "Database connection failed"
- Check MySQL is running
- Check `.env` has correct DB credentials
- Check database name matches `.env` file

### Bookings don't appear
- Check React frontend made the booking (check network in DevTools)
- Check MySQL has records in `bookings` table
- Verify admin is logged in with valid JWT token

### Styles not loading (unstyled page)
- Check `app.js` has `app.use(express.static("public"))`
- Check `admin.css` exists in `server/public/css/`
- Restart server

### JavaScript not working
- Check browser console for errors (F12)
- Check `admin.js` exists in `server/public/js/`
- Check script tag in HTML points to correct path

## Checklist

Use this checklist to verify everything works:

- [ ] Backend server starts without errors
- [ ] Admin dashboard loads at `/admin`
- [ ] Can register new admin account
- [ ] Can login with admin credentials
- [ ] Hotels tab displays correctly
- [ ] Can add new hotel
- [ ] Can edit existing hotel
- [ ] Can delete hotel
- [ ] Can navigate to Bookings tab
- [ ] Bookings from public site appear in admin
- [ ] Can confirm booking
- [ ] Can reject booking
- [ ] Logout works and clears session
- [ ] Login again works
- [ ] All data persists in MySQL
- [ ] No console errors in browser
- [ ] No errors in server terminal

## Performance Notes

- First page load may take 1-2 seconds (server-side rendering)
- Data fetches are instantaneous after authentication
- Modal animations are smooth (0.3s transitions)
- Database queries are optimized with proper indexing

## Next Steps After Testing

1. ✅ Test all features (use this guide)
2. 📋 Fix any issues found
3. 📋 Customize styling to match your brand
4. 📋 Add more admin features (reports, analytics)
5. 📋 Set up SSL/HTTPS for production
6. 📋 Deploy to hosting service

---

**Happy Testing!** 🎉

If all tests pass, your MICE booking system is fully functional! 🚀
