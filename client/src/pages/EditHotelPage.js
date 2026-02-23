import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminAPI, hotelAPI } from "../services/api";
import "./AdminPage.css";

export default function EditHotelPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", location: "", capacity: "", price_range: "", description: "", image_url: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await hotelAPI.getHotelById(id);
        const h = resp.data.data || resp.data || {};
        setForm({
          name: h.name || "",
          location: h.location || "",
          capacity: h.capacity || "",
          price_range: h.price_range || "",
          description: h.description || "",
          image_url: h.image_url || "",
          email: h.email || "",
        });
      } catch (err) {
        setMessage("Error loading hotel: " + (err.response?.data?.error || err.message));
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.capacity) {
      setMessage("Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMessage("No admin token found");
        return;
      }
      await adminAPI.updateHotel(id, form, token);
      navigate('/admin');
    } catch (err) {
      setMessage("Error updating hotel: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>✏️ {t("edit")} Hotel</h1>
        </div>
      </header>

      <div className="admin-container">
        {message && <div className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</div>}
        <div style={{maxWidth: 720, margin: "20px auto", padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 8}}>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{t("name")}</label>
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t("location")}</label>
              <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t("capacity")}</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t("price_range")}</label>
              <input value={form.price_range} onChange={(e) => setForm({...form, price_range: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{t("description")}</label>
              <input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{t("image")}</label>
              <input value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            </div>

            <div style={{display: "flex", gap: 10}}>
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? t("loading") : t("update")}</button>
              <button type="button" className="btn-delete" onClick={() => navigate('/admin')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
