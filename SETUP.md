# Quick Start Guide - Zanzibar MICE Connect

## Prerequisites
- Node.js v14+ installed
- MySQL database installed and running
- npm or yarn package manager

## Step-by-Step Setup

### Step 1: Database Setup (5 minutes)

1. **Open MySQL Command Line:**
```bash
mysql -u root -p
```

2. **Create Database and Tables:** Run the SQL schema commands:
```bash
Source database/schema.sql
```

Or copy-paste the entire schema from `database/schema.sql` into MySQL Workbench/phpMyAdmin.

**Expected Output:**
- ✅ Database `mice_zanzibar` created
- ✅ Tables created: `hotels`, `bookings`, `admin_users`
- ✅ Sample hotel data inserted

---

### Step 2: Backend Setup (10 minutes)

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
copy .env.example .env
```

4. **Edit .env with your settings:**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=  (leave empty if no password)
DB_NAME=mice_zanzibar
JWT_SECRET=your_secret_key_here_change_this
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
NODE_ENV=development
PORT=5000
```

5. **Start the server:**
```bash
npm start
```

**Expected Output:**
```
MySQL Connected successfully
Server running on port 5000
```

---

### Step 3: Frontend Setup (10 minutes)

1. **In a new terminal, navigate to client directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start React development server:**
```bash
npm start
```

**Expected Output:**
- Browser opens to http://localhost:3000
- You should see the Zanzibar MICE Connect homepage

---

## Testing the Application

### 1. Test Homepage (Public)
- [ ] Visit http://localhost:3000
- [ ] See hotel listings
- [ ] Language switcher works (EN/SW)
- [ ] Click "Request Booking" - form appears
- [ ] Submit booking form - success message shows

### 2. Test Admin Panel
- [ ] Go to http://localhost:3000/admin
- [ ] Click "Register" tab
- [ ] Create admin account:
  - Username: admin
  - Email: admin@test.com
  - Password: Test@123

- [ ] Click "Login" tab
- [ ] Login with credentials

- [ ] In Admin Dashboard:
  - [ ] See "Manage Hotels" tab with list
  - [ ] See "Manage Bookings" tab with submitted bookings
  - [ ] Try Confirm/Reject buttons

### 3. Test API Endpoints

Using Postman or curl:

```bash
# Get all hotels
curl http://localhost:5000/api/hotels

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": 1,
    "client_name": "John Doe",
    "email": "john@example.com",
    "event_type": "Conference",
    "guests": 100,
    "event_date": "2026-05-01",
    "message": "Need full package"
  }'

# Admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "Test@123"}'
```

---

## Common Issues & Solutions

### Issue: MySQL Connection Failed
**Solution:**
- Verify MySQL is running
- Check credentials in .env
- Ensure database name is correct

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Change PORT in .env to 5001 or another available port
# Or kill process using port 5000
```

### Issue: Email Not Sending
**Solution:**
- Use Gmail with App Password (not regular password)
- Enable 2-factor authentication on Google account
- Generate App Password from https://myaccount.google.com/apppasswords

### Issue: CORS Error
**Solution:**
- Ensure backend is running on http://localhost:5000
- Check that proxy in client/package.json is correct
- Restart both frontend and backend

### Issue: React App Not Loading
**Solution:**
- Clear browser cache: Ctrl+Shift+Delete
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available

---

## File Structure

```
web_task/
├── database/
│   └── schema.sql                    # Database schema
├── server/
│   ├── controllers/
│   │   ├── hotelController.js       # Hotel logic
│   │   ├── bookingController.js     # Booking logic
│   │   └── adminController.js       # Admin logic with JWT
│   ├── routes/
│   │   ├── hotelRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── app.js                        # Express server
│   ├── package.json
│   ├── .env                          # Environment variables
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HotelCard.js
│   │   │   └── BookingForm.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   └── AdminPage.js
│   │   ├── services/
│   │   │   └── api.js                # API calls
│   │   ├── locales/
│   │   │   ├── en.json              # English translations
│   │   │   └── sw.json              # Swahili translations
│   │   ├── i18n.js                  # i18n config
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
└── README.md
```

---

## Next Steps

1. **Customize Hotels Data:**
   - Edit `database/schema.sql` to add more hotels
   - Update hotel images
   - Modify price ranges and descriptions

2. **Add Google Maps:**
   - Get API key from Google Cloud Console
   - Implement map component in HomePage
   - Show hotel locations on map

3. **Email Customization:**
   - Modify email templates in `bookingController.js`
   - Add more email notifications

4. **Styling:**
   - Customize colors and fonts
   - Add your branding
   - Improve responsive design

5. **Deployment:**
   - Deploy backend to Heroku/AWS/DigitalOcean
   - Deploy frontend to Vercel/Netlify
   - Set up proper environment variables

---

## Support

If you encounter any issues:
1. Check the README.md for detailed documentation
2. Review the console for error messages
3. Verify all prerequisites are installed
4. Ensure database is properly initialized

---

**Ready to launch? Follow the steps above and you'll have the app running in ~25 minutes!** 🚀
