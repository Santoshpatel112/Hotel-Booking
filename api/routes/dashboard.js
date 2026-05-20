import express from 'express';
import {
  getDashboardOverview,
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getBookings,
  getRevenue,
  getAnalytics
} from '../Controllers/dashboard.js';
const router = express.Router();

// Dashboard overview
router.get('/overview', getDashboardOverview);

// Hotels routes
router.get('/hotels', getHotels);
router.post('/hotels', createHotel);
router.put('/hotels/:id', updateHotel);
router.delete('/hotels/:id', deleteHotel);

// Users routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Bookings routes
router.get('/bookings', getBookings);

// Revenue routes
router.get('/revenue', getRevenue);

// Analytics routes
router.get('/analytics', getAnalytics);

export default router;