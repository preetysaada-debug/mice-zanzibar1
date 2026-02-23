import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminAPI } from "../services/api";
import "./AdminPage.css";

export default function AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("hotels");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  

  useEffect(() => {
    // Safety check: verify admin token exists
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      console.log("❌ No admin token found, redirecting to login");
      navigate("/admin-login");
      return;
    }
    console.log("✅ Admin token found, loading data...");
    setLoadingData(true);
    fetchHotels();
    fetchBookings();
  }, [navigate]);

  const fetchHotels = async () => {
    try {
      console.log("📡 Fetching hotels...");
      const response = await fetch("http://localhost:5000/api/hotels");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      console.log("✅ Hotels loaded:", data.data?.length || 0, "hotels");
      setHotels(data.data || []);
      setLoadingData(false);
    } catch (err) {
      console.error("❌ Error fetching hotels:", err);
      setMessage("Error loading hotels: " + err.message);
      setLoadingData(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("❌ No admin token found for bookings");
        return;
      }
      console.log("📡 Fetching bookings with token...");
      const response = await adminAPI.getAllBookings(token);
      console.log("✅ Bookings loaded:", response.data.data?.length || 0, "bookings");
      setBookings(response.data.data || []);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setMessage("Error loading bookings: " + (err.response?.data?.error || err.message));
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found");
        return;
      }
      await adminAPI.updateBookingStatus(bookingId, status, token);
      setMessage(`Booking ${status}!`);
      fetchBookings();
    } catch (err) {
      setMessage("Error updating booking status: " + (err.response?.data?.error || err.message));
    }
  };

  

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) {
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage("No admin token found");
        return;
      }
      await adminAPI.deleteHotel(hotelId, token);
      setMessage("Hotel deleted successfully!");
      fetchHotels();
    } catch (err) {
      setMessage("Error deleting hotel: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>📊 {t("dashboard")}</h1>
          <p className="subtle">{t("manage_hotels")} • {t("manage_bookings")}</p>
        </div>
        <div className="admin-header-right">
          <button className="nav-add" onClick={() => navigate('/admin/hotels/add')}>+ {t("add")}</button>
          <button className="logout-btn" onClick={handleLogout}>{t("logout")}</button>
        </div>
      </header>

      <div className="admin-container">
        {message && <div className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</div>}

        {loadingData && <div className="message" style={{textAlign: "center"}}>⏳ Loading admin dashboard...</div>}

        {!loadingData && (
          <>
            <div className="admin-tabs">
              <button 
                className={`tab-btn ${activeTab === "hotels" ? "active" : ""}`}
                onClick={() => setActiveTab("hotels")}
              >
                {t("manage_hotels")}
              </button>
              <button 
                className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
                onClick={() => setActiveTab("bookings")}
              >
                {t("manage_bookings")}
              </button>
            </div>

            {activeTab === "hotels" ? (
          <div className="hotels-section">
            <h2>{t("manage_hotels")}</h2>
            {/* Add button moved to navbar */}

            <div className="hotels-list">
              {hotels.map(hotel => {
                // derive image path (fallback to a default image)
                const rawUrl = hotel.image_url || "/images/hotel2.jpeg";
                // image URLs are already safe short names
                const imgSrc = rawUrl.startsWith("/") ? rawUrl : `/images/${rawUrl}`;
                return (
                <div key={hotel.id} className="hotel-item">
                  <div className="hotel-thumb">
                    <img src={imgSrc} alt={hotel.name} onError={(e)=>{e.target.onerror=null; e.target.src='/images/hotel2.jpeg'}} />
                  </div>
                  <div className="hotel-info">
                    <h3>{hotel.name}</h3>
                    <p>{hotel.location} • Capacity: {hotel.capacity}</p>
                    <p className="muted">{hotel.price_range} • {hotel.email}</p>
                  </div>
                  <div className="hotel-actions">
                    <button className="btn-view" onClick={() => navigate(`/admin/hotels/${hotel.id}/edit`)}>🔍 {t("view")}</button>
                    <button className="btn-delete" onClick={() => handleDeleteHotel(hotel.id)}>🗑️ {t("delete")}</button>
                  </div>
                </div>
              )})}
            </div>
          </div>
        ) : (
          <div className="bookings-section">
            <h2>{t("manage_bookings")}</h2>
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-info">
                    <h3>{booking.client_name}</h3>
                    <p>{booking.hotel_name} • {booking.event_type}</p>
                    <p>{booking.email} • Guests: {booking.guests}</p>
                    <span className={`status ${booking.status}`}>{booking.status}</span>
                  </div>
                  <div className="booking-actions">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                    >
                      🔍 {t("view")}
                    </button>
                    <button 
                      className="btn-confirm"
                      onClick={() => updateBookingStatus(booking.id, "confirmed")}
                    >
                      ✓ {t("confirm")}
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => updateBookingStatus(booking.id, "rejected")}
                    >
                      ✕ {t("reject")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </div>

      <footer className="admin-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>📊 System</h4>
            <p>MICE Zanzibar Admin Dashboard - Manage hotels, bookings, and events with ease.</p>
          </div>
          <div className="footer-section">
            <h4>🔗 Quick Links</h4>
            <ul>
              <li><a href="#hotels">Hotel Management</a></li>
              <li><a href="#bookings">Booking Management</a></li>
              <li><a href="#logout">Logout</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>ℹ️ Support</h4>
            <ul>
              <li>Email: <a href="mailto:admin@zanzibar.com">admin@zanzibar.com</a></li>
              <li>Phone: +255 777 000 000</li>
              <li>Status: <span style={{color: '#86efac'}}>● Online</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 MICE Zanzibar. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#security">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
