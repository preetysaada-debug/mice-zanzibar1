# Server-Side Admin Dashboard Guide

## Overview

The Zanzibar MICE Connect application includes a **server-side admin dashboard** built with HTML, CSS, and JavaScript. This dashboard runs directly on the backend server and provides separate management tools from the React frontend.

## Architecture

- **Frontend (React)**: Public-facing website at `http://localhost:3000`
  - Hotel listings and browsing
  - Hotel booking form
  - Multi-language support (English/Swahili)

- **Backend Admin Dashboard (Server-rendered HTML)**: Admin tools at `http://localhost:5000/admin`
  - Hotel management (Add, Edit, Delete)
  - Booking management (Confirm, Reject)
  - User authentication and session management

## Accessing the Admin Dashboard

1. **Start the backend server**:
   ```bash
   cd server
   npm install
   npm start
   ```
   Server runs on `http://localhost:5000`

2. **Open admin dashboard in browser**:
   ```
   http://localhost:5000/admin
   ```

3. **First time setup**:
   - Click **"Register here"** to create an admin account
   - Enter email and password
   - Click **Register** button
   - You will be logged in automatically

4. **Subsequent logins**:
   - Use your registered email and password
   - Click **Login** button

## Admin Dashboard Features

### 1. Hotels Management Tab

**View All Hotels**:
- See all hotels in a grid layout
- Display hotel name, location, capacity, price range, and email
- Hotels are fetched from the MySQL database

**Add New Hotel**:
- Click **"+ Add New Hotel"** button
- Fill in the form:
  - Hotel Name
  - Location
  - Capacity (number of guests)
  - Price Range
  - Description
  - Image URL (external image link)
  - Email (contact email)
- Click **Save Hotel**
- New hotel appears in the grid immediately

**Edit Hotel**:
- Click **✏️ Edit** button on any hotel card
- Form pre-fills with current hotel data
- Modify any field
- Click **Save Hotel** to update
- Changes appear immediately

**Delete Hotel**:
- Click **🗑️ Delete** button on any hotel card
- Confirm deletion in the popup
- Hotel is removed from the database and grid

### 2. Bookings Management Tab

**View All Bookings**:
- See list of all guest bookings
- Display client name, hotel, email, event type, guest count, date, and message
- Each booking shows its current status (pending, confirmed, rejected)

**Confirm Booking**:
- Click **✓ Confirm** button on any booking
- Status changes to "confirmed"
- Guest will receive confirmation email

**Reject Booking**:
- Click **✕ Reject** button on any booking
- Status changes to "rejected"
- Guest will receive rejection email

### 3. Authentication

**Login**:
- Email-based login system
- JWT token stored in browser localStorage
- Token sent with every API request for authorization
- Token persists across browser sessions

**Register**:
- Create new admin accounts
- Email must be unique
- Password stored securely with bcryptjs hashing
- Automatically logs in new admin users

**Logout**:
- Click **Logout** button in top-right corner
- Clears JWT token from localStorage
- Redirects to login page
- Session ends immediately

## File Structure

```
server/
├── app.js                          # Main Express server with admin routes
├── views/
│   └── admin.html                 # Admin dashboard HTML
├── public/
│   ├── css/
│   │   └── admin.css              # Admin dashboard styling
│   └── js/
│       └── admin.js               # Admin dashboard logic
├── controllers/
│   ├── hotelController.js         # Hotel API logic
│   ├── bookingController.js       # Booking API logic
│   └── adminController.js         # Admin API logic (auth, CRUD)
├── routes/
│   ├── hotelRoutes.js             # Hotel API routes
│   ├── bookingRoutes.js           # Booking API routes
│   └── adminRoutes.js             # Admin API routes
├── .env.example                   # Environment variables template
└── package.json                   # Dependencies
```

## API Endpoints (Used by Admin Dashboard)

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Admin registration

### Hotels (Admin)
- `GET /api/admin/hotels` - Get all hotels (admin)
- `POST /api/admin/hotel` - Create new hotel
- `PUT /api/admin/hotel/:id` - Update hotel
- `DELETE /api/admin/hotel/:id` - Delete hotel

### Bookings (Admin)
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/booking/:id/status` - Update booking status

## Styling and Design

- **Color Scheme**: Purple to blue gradient (#667eea → #764ba2)
- **Modern Glassmorphism**: Semi-transparent cards with blur effects
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in effects and hover transitions
- **Tab System**: Clean tab interface for Hotels and Bookings

## Key JavaScript Functions

### Authentication
```javascript
handleLogin(event)         // Process login form submission
handleRegister(event)      // Process registration form submission
logout()                   // Clear token and redirect to login
showDashboard()            // Display dashboard (hide login)
```

### Hotels Management
```javascript
loadHotels()               // Fetch and display all hotels
openAddHotelModal()        // Open modal for new hotel
editHotel(...)             // Open modal with hotel data for editing
saveHotel(event)           // Save hotel (POST or PUT)
deleteHotel(id)            // Delete hotel from database
closeHotelModal()          // Close modal
```

### Bookings Management
```javascript
loadBookings()             // Fetch and display all bookings
updateBookingStatus(id, status)  // Change booking status
```

### UI
```javascript
switchTab(tabName)         // Switch between Hotels and Bookings tabs
showMessage(message, type) // Display success/error messages
```

## Security Features

1. **JWT Authentication**:
   - Token-based authentication system
   - Tokens expire after set time
   - Backend validates tokens on protected routes

2. **Password Security**:
   - Passwords hashed with bcryptjs
   - Never stored in plain text
   - Verified on admin login

3. **Authorization**:
   - Only authenticated admins can manage hotels/bookings
   - Public API endpoints don't require auth

## Troubleshooting

### Can't access admin dashboard
- Ensure backend server is running: `npm start`
- Check port 5000 is not blocked
- Verify MySQL connection is active

### Login fails
- Check email and password are correct
- Verify MySQL database has admin_users table
- Check .env file has correct database credentials

### Hotels/Bookings not loading
- Check backend API is responding at `/api/hotels` and `/api/bookings`
- Verify MySQL database connection
- Check browser console for CORS errors
- Confirm JWT token is valid

### Changes not saving
- Verify network request in browser DevTools
- Check API response for error messages
- Ensure JWT token hasn't expired
- Confirm database has write permissions

## Comparison: Admin Dashboard vs React Frontend

| Feature | Admin Dashboard (Server) | React Frontend (Public) |
|---------|--------------------------|------------------------|
| Access | Admin users only | Public/anyone |
| Hotel Management | Full CRUD | Read-only |
| Booking Management | Confirm/Reject | Create only |
| Authentication | JWT required | Optional |
| Technology | HTML/CSS/JS | React |
| Rendering | Server-side | Client-side |
| Performance | Faster initial load | SPA benefits |
| Use Case | Internal management | Guest interface |

## Next Steps

1. **Create first admin account**: Visit `/admin` and register
2. **Add sample hotels**: Use the Hotels tab to create test hotels
3. **Test bookings**: Make bookings from public site (port 3000)
4. **Manage bookings**: Confirm or reject bookings in admin dashboard
5. **Deploy**: Follow main README for deployment instructions

## Support

For issues or questions:
1. Check browser console (F12) for JavaScript errors
2. Check server terminal for API errors
3. Verify all environment variables in .env
4. Ensure MySQL server is running
5. Review logs in server terminal output
