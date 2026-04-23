import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api', // Enables proxy in dev and Vercel routing in prod
  withCredentials: true,
  timeout: 10000, // 10 second timeout for better robustness
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
    // Check for network errors (host down or unreachable)
    if (!error.response) {
      console.error('🌐 Network Error - Server might be offline:', error.message);
      // We don't toast here to avoid spamming, the ConnectionBanner will handle the UI
    }

    if (error.response?.status === 401) {
      // Don't redirect if we're already on login/register to avoid loops
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Service Unavailable or Internal Server Error (often DB issues)
    if (error.response?.status === 503 || error.response?.status === 500) {
        const msg = error.response.data?.message || 'The server is having trouble. Please try again later.';
        toast.error(msg, { id: 'server-error' });
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
  
  // Health check
  checkHealth: () => api.get('/health', { timeout: 3000 }),
};

// Room API functions
export const roomAPI = {
  getAllRooms: () => api.get('/rooms'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (hotelId, roomData) => api.post(`/rooms/${hotelId}`, roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id, hotelId) => api.delete(`/rooms/${id}/${hotelId}`),
  updateRoomAvailability: (id, dates) => api.put(`/rooms/availability/${id}`, { dates }),
};

// User API functions
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  refreshToken: () => api.post('/auth/refresh'),
};

export default api;
