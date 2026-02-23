import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./BookingForm.css";
import { bookingAPI } from "../services/api";

export default function BookingForm({ hotel, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    hotel_id: hotel.id,
    client_name: "",
    email: "",
    event_type: "",
    guests: "",
    event_date: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const bookingData = {
        ...formData,
        user_id: user.id || null
      };
      await bookingAPI.createBooking(bookingData);
      onSuccess?.();
      setFormData({
        hotel_id: hotel.id,
        client_name: "",
        email: "",
        event_type: "",
        guests: "",
        event_date: "",
        message: ""
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal">
      <div className="booking-form-container">
        <div className="form-header-image">
          <img src={hotel.image_url} alt={hotel.name} className="form-hotel-image" />
          <div className="form-header-overlay">
            <h2>{t("request_booking")}</h2>
            <p>{hotel.name}</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>{t("full_name")} *</label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>{t("email")} *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t("event_type")}</label>
              <select name="event_type" value={formData.event_type} onChange={handleChange}>
                <option value="">Select Event Type</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t("guests")}</label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                placeholder="100"
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t("event_date")} *</label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("message")}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about your event requirements..."
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              {t("cancel")}
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? t("loading") : t("submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
