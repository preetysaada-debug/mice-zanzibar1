import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adminAPI } from "../services/api";
import "./AdminLoginPage.css";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authTab, setAuthTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // If already logged in as admin, redirect to dashboard
    if (localStorage.getItem("adminToken")) {
      console.log("✅ Admin token found, redirecting to dashboard...");
      navigate("/admin");
    } else {
      console.log("🔓 No admin token, showing login form...");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      console.log("Attempting login with:", loginForm.email);
      const response = await adminAPI.login(loginForm.email, loginForm.password);
      console.log("Login response:", response.data);
      localStorage.setItem("adminToken", response.data.token);
      setMessage("Login successful! Redirecting...");
      setLoginForm({ email: "", password: "" });
      // Redirect to admin dashboard after successful login
      setTimeout(() => navigate("/admin"), 800);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Login failed";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      console.log("Attempting register with:", registerForm.username, registerForm.email);
      const response = await adminAPI.register(registerForm.username, registerForm.email, registerForm.password);
      console.log("Register response:", response.data);
      localStorage.setItem("adminToken", response.data.token);
      setMessage("Registration successful! Redirecting...");
      setRegisterForm({ username: "", email: "", password: "", confirmPassword: "" });
      // Auto-login after registration
      setTimeout(() => navigate("/admin"), 800);
    } catch (err) {
      console.error("Register error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Registration failed";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="auth-card">
          <h1>🔐 Admin Panel</h1>
          
          {message && <div className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</div>}

          <div className="auth-tabs">
            <button 
              className={`tab-btn ${authTab === "login" ? "active" : ""}`}
              onClick={() => setAuthTab("login")}
            >
              {t("login")}
            </button>
            <button 
              className={`tab-btn ${authTab === "register" ? "active" : ""}`}
              onClick={() => setAuthTab("register")}
            >
              {t("register")}
            </button>
          </div>

          {authTab === "login" ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>{t("email")}</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("password")}</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? t("loading") : t("login")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label>{t("username")}</label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("email")}</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("password")}</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("confirm_password")}</label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? t("loading") : t("register")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
