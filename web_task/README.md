# Zanzibar MICE Connect

A full-stack web application for managing MICE (Meetings, Incentives, Conferences, and Exhibitions) events in Zanzibar. Built with React, Node.js, Express, and MySQL.

## 🚀 Features

- **Hotel Listing**: Browse available hotels with detailed information
- **Booking System**: Request bookings for hotels with event details
- **Admin Panel**: Manage hotels and booking requests
- **Multi-language Support**: English and Swahili translations
- **Email Notifications**: Automated booking confirmation emails
- **JWT Authentication**: Secure admin authentication
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
zanzibar-mice/
├── server/              (Node.js + Express backend)
│   ├── controllers/     (Business logic)
│   ├── routes/          (API endpoints)
│   ├── models/          (Database models)
│   ├── app.js          (Main server file)
│   ├── package.json    (Dependencies)
│   └── .env.example    (Environment variables template)
│
├── client/              (React frontend)
│   ├── src/
│   │   ├── components/ (React components)
│   │   ├── pages/      (Page components)
│   │   ├── services/   (API services)
│   │   ├── locales/    (Translation files)
│   │   ├── App.js      (Main App component)
│   │   └── index.js    (Entry point)
│   ├── public/         (Static files)
│   └── package.json    (Dependencies)
│
└── database/
    └── schema.sql      (Database schema)
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14+)
- npm or yarn
- MySQL (v5.7+)

## 📦 Installation & Setup

### 1. Database Setup

```bash
# Open MySQL command line and run:
mysql -u root -p

# Then execute the schema.sql file:
mysql -u root -p < database/schema.sql
```

Or import the schema using MySQL Workbench/phpMyAdmin.

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file from .env.example
cp .env.example .env

# Edit .env with your configuration
# - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
# - GMAIL_USER and GMAIL_PASSWORD for email notifications
# - JWT_SECRET for authentication

# Start the server
npm start
# Or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the React development server
npm start
```

Frontend will open on `http://localhost:3000`

## 🔑 Environment Variables

### Server (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mice_zanzibar

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

GMAIL_USER=your@gmail.com
GMAIL_PASSWORD=your_app_password

NODE_ENV=development
PORT=5000
```

**Note**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

## 📡 API Endpoints

### Public Routes

- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get single hotel
- `POST /api/bookings` - Create booking request

### Admin Routes (Protected with JWT)

- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Admin registration
- `POST /api/admin/hotel` - Add new hotel
- `PUT /api/admin/hotel/:id` - Update hotel
- `DELETE /api/admin/hotel/:id` - Delete hotel
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/booking/:id/status` - Update booking status

## 🗄️ Database Schema

### Hotels Table
```sql
CREATE TABLE hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  location VARCHAR(255),
  capacity INT,
  price_range VARCHAR(100),
  description TEXT,
  image_url TEXT,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT,
  client_name VARCHAR(255),
  email VARCHAR(255),
  event_type VARCHAR(100),
  guests INT,
  event_date DATE,
  message TEXT,
  status ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 Language Support

The application supports:
- **English (en)** - Default language
- **Swahili (sw)** - For East Africa region

Language preference is saved in localStorage. Users can switch languages from the header.

## 🔐 Security Features

- JWT token-based authentication for admin routes
- Password hashing with bcryptjs
- CORS enabled for frontend-backend communication
- Input validation on all endpoints
- SQL injection prevention with parameterized queries

## 💻 Frontend Features

- **HomePage**: Browse and book hotels
- **AdminPage**: Manage hotels and booking requests
- **Authentication**: Secure admin login/registration
- **Responsive UI**: Mobile-friendly design
- **i18n Support**: Multi-language interface

## 🚀 Running the Application

### Terminal 1 - Backend
```bash
cd server
npm start
```

### Terminal 2 - Frontend
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## 📝 Example Workflow

1. **User**: Visit homepage and browse hotels
2. **User**: Click "Request Booking" on a hotel
3. **User**: Fill booking form with event details
4. **System**: Send confirmation email to user
5. **Admin**: Log in to admin panel
6. **Admin**: View all booking requests
7. **Admin**: Confirm or reject booking
8. **Admin**: Manage hotel listings

## 🐛 Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Verify MySQL is running and credentials are correct
- Check .env file configuration

### Frontend won't connect
- Ensure backend is running on port 5000
- Check CORS configuration in app.js
- Clear browser cache and cookies

### Email not sending
- Verify Gmail credentials in .env
- Use an App Password, not regular password
- Enable "Less Secure App Access" if needed

## 📦 Dependencies

### Backend
- express: Web framework
- cors: Cross-origin resource sharing
- mysql2: MySQL database driver
- nodemailer: Email sending
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- dotenv: Environment variables

### Frontend
- react: UI library
- axios: HTTP client
- react-i18next: Internationalization
- react-router-dom: Routing
- @react-google-maps/api: Google Maps integration

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For support, please contact or create an issue in the repository.

---

**Made with ❤️ for Zanzibar MICE Events**
