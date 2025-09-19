import express from "express";
import {
    getDashboardStats,
    getLiveMetrics,
    getRevenueAnalytics
} from "../Controllers/analytics.js";
import { verifyAdmin } from "../utils/Verifytoken.js";

const router = express.Router();

/**
 * Real-time Analytics Routes
 * All routes require admin authentication
 */

// Get comprehensive dashboard statistics
router.get("/dashboard", verifyAdmin, getDashboardStats);

// Get live metrics for real-time updates
router.get("/live", verifyAdmin, getLiveMetrics);

// Get revenue analytics with period filtering
router.get("/revenue", verifyAdmin, getRevenueAnalytics);

export default router;