import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js"; // Middleware ka naam aur path check kar lein

const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get("/stats", protect, authorize("admin"), getAdminStats);

export default router;