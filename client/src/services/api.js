import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const hotelAPI = {
  getAllHotels: () => axios.get(`${API_BASE_URL}/hotels`),
  getHotelById: (id) => axios.get(`${API_BASE_URL}/hotels/${id}`)
};

export const bookingAPI = {
  createBooking: (data) => axios.post(`${API_BASE_URL}/bookings`, data),
  getBookings: () => axios.get(`${API_BASE_URL}/bookings`),
  getBookingById: (id) => axios.get(`${API_BASE_URL}/bookings/${id}`),
  updateBookingStatus: (id, status) => 
    axios.put(`${API_BASE_URL}/bookings/${id}`, { status }),
  getUserBookings: (token) => 
    axios.get(`${API_BASE_URL}/bookings/my-bookings/list`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export const userAPI = {
  register: (email, password, firstName, lastName, phone, company) => 
    axios.post(`${API_BASE_URL}/users/register`, { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      company 
    }),
  login: (email, password) => 
    axios.post(`${API_BASE_URL}/users/login`, { email, password }),
  getProfile: (token) => 
    axios.get(`${API_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateProfile: (data, token) => 
    axios.put(`${API_BASE_URL}/users/profile`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export const adminAPI = {
  login: (email, password) => 
    axios.post(`${API_BASE_URL}/admin/login`, { email, password }),
  register: (username, email, password) => 
    axios.post(`${API_BASE_URL}/admin/register`, { username, email, password }),
  addHotel: (data, token) => 
    axios.post(`${API_BASE_URL}/admin/hotel`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateHotel: (id, data, token) => 
    axios.put(`${API_BASE_URL}/admin/hotel/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  deleteHotel: (id, token) => 
    axios.delete(`${API_BASE_URL}/admin/hotel/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  getAllBookings: (token) => 
    axios.get(`${API_BASE_URL}/admin/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  updateBookingStatus: (id, status, token) => 
    axios.put(`${API_BASE_URL}/admin/booking/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
};
