import React from "react";
import "./HotelCard.css";

export default function HotelCard({ hotel, onBook }) {
  return (
    <div className="hotel-card">
      <div className="hotel-image">
        <img
          src={hotel.image_url || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%25' height='100%25' fill='%23e6f2ff'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230066cc' font-size='24' font-family='Arial'>No%20Image</text></svg>`}
          alt={hotel.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%25' height='100%25' fill='%23e6f2ff'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%230066cc' font-size='24' font-family='Arial'>No%20Image</text></svg>`;
            e.target.style.objectFit = 'contain';
            e.target.style.background = '#e6f2ff';
          }}
        />
      </div>
      
      <div className="hotel-content">
        <h2 className="hotel-name">{hotel.name}</h2>
        <p className="hotel-location">📍 {hotel.location}</p>

        <div className="hotel-details">
          <span>👥 {hotel.capacity} guests</span>
          <span className="price-range">💰 {hotel.price_range}</span>
        </div>

        <p className="hotel-description">{hotel.description}</p>

        <button className="book-button" onClick={() => onBook(hotel)}>
          Request Booking
        </button>
      </div>
    </div>
  );
}
