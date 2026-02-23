-- Create MICE Zanzibar Database
CREATE DATABASE IF NOT EXISTS mice_zanzibar;
USE mice_zanzibar;

-- Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  price_range VARCHAR(100),
  description TEXT,
  image_url TEXT,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Regular Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  hotel_id INT NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  event_type VARCHAR(100),
  guests INT,
  event_date DATE,
  message TEXT,
  status ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Hotels Data
INSERT INTO hotels (name, location, capacity, price_range, description, image_url, email) VALUES
('Stone Town Hotel', 'Stone Town', 150, '$$$', 'Historic hotel in the heart of Stone Town with elegant courtyard ambiance', '/images/hotel1.jpeg', 'stonetown@zanzibar.com'),
('Nungwi Beach Resort', 'Nungwi', 300, '$$$$', 'Luxury beachfront resort with world-class water sports and activities', '/images/hotel2.jpeg', 'nungwi@zanzibar.com'),
('Jambiani Conference Center', 'Jambiani', 200, '$$$', 'Modern conference facilities with beautiful beach views and premium services', '/images/hotel7.jpeg', 'jambiani@zanzibar.com');
