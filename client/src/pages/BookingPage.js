import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BookingForm from "../components/BookingForm";
import "./BookingPage.css";

export default function BookingPage() {
  const { t } = useTranslation();
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const hotel = location.state?.hotel;

  const handleBookingSuccess = () => {
    setSuccessMessage(t("booking_sent"));
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!hotel) {
    return (
      <div className="booking-page error-state">
        <div className="error-content">
          <p>Hotel information not found</p>
          <button className="back-btn" onClick={handleGoBack}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <header className="booking-header">
        <button className="back-btn" onClick={handleGoBack}>
          ← Back
        </button>
        <h1>Book {hotel.name}</h1>
        <div></div>
      </header>

      <main className="booking-main">
        {successMessage && (
          <div className="success-message">
            ✅ {successMessage}
          </div>
        )}

        <BookingForm
          hotel={hotel}
          onClose={handleGoBack}
          onSuccess={handleBookingSuccess}
        />
      </main>

      <footer className="booking-footer">
        <p>&copy; 2026 Zanzibar MICE Connect. All rights reserved.</p>
      </footer>
    </div>
  );
}
