import express from "express";
import {
    getDashboardStats,
    getLiveMetrics,
    getRevenueAnalytics
} from "../Controllers/analytics.js";
import { verifyAdmin } from "../utils/Verifytoken.js";

const router = express.Router();

router.get("/dashboard", verifyAdmin, getDashboardStats);

router.get("/live", verifyAdmin, getLiveMetrics);

router.get("/revenue", verifyAdmin, getRevenueAnalytics);

export default router;