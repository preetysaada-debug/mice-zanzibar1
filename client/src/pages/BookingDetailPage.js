import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingAPI, adminAPI } from "../services/api";
import "./BookingDetailPage.css";

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getBookingById(id);
      setBooking(res.data.data || res.data || null);
    } catch (err) {
      console.error(err);
      setMessage("Unable to load booking");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (status) => {
    try {
      const token = localStorage.getItem("adminToken");
      await adminAPI.updateBookingStatus(id, status, token);
      setMessage(`Booking ${status}`);
      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      console.error(err);
      setMessage("Error updating booking status");
    }
  };

  if (loading) return <div className="booking-detail-page"><div className="loading">Loading...</div></div>;
  if (!booking) return <div className="booking-detail-page"><div className="error">Booking not found</div></div>;

  return (
    <div className="booking-detail-page">
      <header className="bd-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1>Booking Detail</h1>
        <div />
      </header>

      {message && <div className="bd-message">{message}</div>}

      <main className="bd-main">
        <div className="bd-card">
          <div className="bd-row">
            <div>
              <h2 className="client-name">{booking.client_name}</h2>
              <p className="muted">{booking.email} • Guests: {booking.guests}</p>
              <p className="muted">{booking.phone}</p>
            </div>
            <div className="status-wrap">
              <span className={`status ${booking.status}`}>{booking.status}</span>
            </div>
          </div>

          <div className="bd-section">
            <h3>Venue</h3>
            <p className="venue">{booking.hotel_name} • {booking.event_type}</p>
          </div>

          <div className="bd-section">
            <h3>Details</h3>
            <p>{booking.special_requests || "No special requests"}</p>
          </div>

          <div className="bd-actions">
            <button className="btn-confirm" onClick={() => handleStatus("confirmed")}>✓ Confirm</button>
            <button className="btn-reject" onClick={() => handleStatus("rejected")}>✕ Reject</button>
          </div>
        </div>
      </main>

      <footer className="bd-footer">© 2026 MICE Zanzibar</footer>
    </div>
  );
}
