import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import AddHotelPage from "./pages/AddHotelPage";
import EditHotelPage from "./pages/EditHotelPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AuthPage from "./pages/AuthPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
}

function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  return adminToken ? children : <Navigate to="/admin-login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);

    // Auto-logout: clear tokens when the browser/tab is closed
    const clearAuth = () => {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("adminToken");
      } catch (e) {
        // ignore
      }
    };

    const handleBeforeUnload = () => {
      clearAuth();
      // navigator.sendBeacon could be used here if a server logout endpoint existed
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Auto-logout when backend becomes unreachable: poll health endpoint
    let healthInterval = null;
    const startHealthCheck = () => {
      healthInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/health', { cache: 'no-store' });
          if (!res || !res.ok) throw new Error('unhealthy');
        } catch (err) {
          // server unavailable -> clear auth and redirect to login
          clearAuth();
          window.location.href = '/auth';
        }
      }, 10000);
    };

    startHealthCheck();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (healthInterval) clearInterval(healthInterval);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/booking/:hotelId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminPage /></AdminProtectedRoute>} />
        <Route path="/admin/bookings/:id" element={<AdminProtectedRoute><BookingDetailPage /></AdminProtectedRoute>} />
        <Route path="/admin/hotels/add" element={<AdminProtectedRoute><AddHotelPage /></AdminProtectedRoute>} />
        <Route path="/admin/hotels/:id/edit" element={<AdminProtectedRoute><EditHotelPage /></AdminProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
