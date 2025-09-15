import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Hotel API functions
export const hotelAPI = {
  // Get all hotels with query parameters
  getAllHotels: async (params = {}) => {
    try {
      console.log('🔍 Searching hotels with params:', params);
      const response = await api.get('/hotels/getall', { params });
      console.log('📦 API Response:', response.data);
      
      // Handle both response formats for backward compatibility
      const hotels = response.data.data || response.data.hotels || response.data || [];
      
      return {
        ...response,
        data: hotels // Ensure consistent data structure
      };
    } catch (error) {
      console.error('❌ Hotel search error:', error);
      throw error;
    }
  },
  
  // Get hotel by ID
  getHotelById: (id) => api.get(`/hotels/get/${id}`),
  
  // Get hotel count by cities
  getCountByCity: (cities) => api.get(`/hotels/countByCity?cities=${cities}`),
  
  // Get detailed count by cities
  getCountByCityDetailed: (cities) => api.get(`/hotels/countByCityDetailed?cities=${cities}`),
  
  // Get count by type
  getCountByType: () => api.get('/hotels/countByType'),
  
  // Get featured hotels
  getFeaturedHotels: (params = { featured: true, limit: 4 }) => 
    api.get('/hotels/featured', { params }),
  
  // Create hotel (admin only)
  createHotel: (hotelData) => api.post('/hotels', hotelData),
  
  // Update hotel (admin only)
  updateHotel: (id, hotelData) => api.put(`/hotels/update/${id}`, hotelData),
  
  // Delete hotel (admin only)
  deleteHotel: (id) => api.delete(`/hotels/delete/${id}`),
  
  // Test database connection
  testDatabase: () => api.get('/hotels/test-db'),
};

// Room API functions
export const roomAPI = {
  // Get all rooms
  getAllRooms: () => api.get('/rooms'),
  
  // Get room by ID
  getRoomById: (id) => api.get(`/rooms/${id}`),
  
  // Create room (admin only)
  createRoom: (hotelId, roomData) => api.post(`/rooms/${hotelId}`, roomData),
  
  // Update room (admin only)
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  
  // Delete room (admin only)
  deleteRoom: (id, hotelId) => api.delete(`/rooms/${id}/${hotelId}`),
  
  // Update room availability
  updateRoomAvailability: (id, dates) => api.put(`/rooms/availability/${id}`, { dates }),
};

// User API functions
export const userAPI = {
  // Get all users (admin only)
  getAllUsers: () => api.get('/users'),
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Update user
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user (admin only)
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Get current user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
};

// Generic API helper functions
export const apiHelpers = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Server error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        status: 0,
        data: null,
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 500,
        data: null,
      };
    }
  },
  
  // Format query parameters for URLs
  formatQueryParams: (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        searchParams.append(key, params[key]);
      }
    });
    return searchParams.toString();
  },
};

export default api;
