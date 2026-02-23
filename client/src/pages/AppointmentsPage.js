import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookingAPI } from "../services/api";
import "./AppointmentsPage.css";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchAppointments(token);
  }, [navigate]);

  const fetchAppointments = async (token) => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings(token);
      setAppointments(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to load appointments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✓";
      case "pending":
        return "⏳";
      case "rejected":
        return "✗";
      default:
        return "?";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="appointments-page">
      <header className="appointments-header">
        <div className="appointments-header-content">
          <h1>📅 My Appointments</h1>
          <p>Track your booking status and appointment details</p>
        </div>
      </header>

      <main className="appointments-main">
        {error && <div className="error-message">❌ {error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No Appointments Yet</h2>
            <p>Make your first booking to see your appointments here</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((apt, index) => (
              <div key={apt.id} className="appointment-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>{apt.hotel_name}</h3>
                    <p className="location">📍 {apt.location}</p>
                  </div>
                  <div className={`status-badge ${getStatusColor(apt.status)}`}>
                    {getStatusIcon(apt.status)} {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Event Date</label>
                      <p className="info-value">{formatDate(apt.event_date)}</p>
                    </div>
                    <div className="info-item">
                      <label>Event Type</label>
                      <p className="info-value">{apt.event_type}</p>
                    </div>
                    <div className="info-item">
                      <label>Guests</label>
                      <p className="info-value">{apt.guests} people</p>
                    </div>
                    <div className="info-item">
                      <label>Booked On</label>
                      <p className="info-value">{formatDate(apt.created_at)}</p>
                    </div>
                  </div>

                  {apt.message && (
                    <div className="message-section">
                      <label>Special Requests</label>
                      <p>{apt.message}</p>
                    </div>
                  )}

                  <div className="contact-info">
                    <label>Contact Email</label>
                    <p>{apt.email}</p>
                  </div>
                </div>

                <div className="card-footer">
                  {apt.status === "pending" && (
                    <p className="pending-note">⏳ Awaiting confirmation from the hotel</p>
                  )}
                  {apt.status === "confirmed" && (
                    <p className="confirmed-note">✓ Your appointment is confirmed!</p>
                  )}
                  {apt.status === "rejected" && (
                    <p className="rejected-note">✗ Your appointment was not approved</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
