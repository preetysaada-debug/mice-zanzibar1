import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HotelCard from "../components/HotelCard";
import { hotelAPI } from "../services/api";
import "./HomePage.css";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelAPI.getAllHotels();
      setHotels(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to load hotels. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleBook = (hotel) => {
    navigate(`/booking/${hotel.id}`, { state: { hotel } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div 
      className="home-page"
      style={{
        backgroundImage: `url(/images/hotel2.jpeg)`
      }}
    >
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🏨 Zanzibar MICE Connect</h1>
          <div className="header-actions">
            <button className="appointments-btn" onClick={() => navigate("/appointments")}>
              📅 My Appointments
            </button>
            <div className="language-selector">
              <button 
                className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en')}
              >
                EN
              </button>
              <button 
                className={`lang-btn ${i18n.language === 'sw' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('sw')}
              >
                SW
              </button>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <h2>{t("welcome")}</h2>
          <p>Discover the best venues for your MICE events in Zanzibar</p>
        </section>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <section className="hotels-section">
          <h2>{t("view_hotels")}</h2>

          {loading ? (
            <div className="loading">{t("loading")}</div>
          ) : hotels.length === 0 ? (
            <div className="no-hotels">No hotels available</div>
          ) : (
            <div className="hotels-grid">
              {hotels.map(hotel => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onBook={() => handleBook(hotel)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Zanzibar MICE Connect. All rights reserved.</p>
      </footer>
    </div>
  );
}
