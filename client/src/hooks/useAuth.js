import { useState } from 'react';
import axios from 'axios';

// Change the export to named export
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register', credentials);
      setUser(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/login', credentials);
      setUser(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  return { getCurrentUser, user, loading, error, signup, login };
};

export { useAuth }; // Instead of 'export default'