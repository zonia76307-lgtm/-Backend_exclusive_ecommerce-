import express from "express";
import { 
  addOrderItems, 
  getOrders, 
  updateOrderStatus,
  getMyOrders,
  getUserStats // 🔥 Isay controller se import karein
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// 1. Order place karna
router.post("/", protect, addOrderItems);

// 2. User ke apne orders ki list (Simple list page ke liye)
router.get("/myorders", protect, getMyOrders);

// 3. User Dashboard Analysis (🔥 Dashboard Stats ke liye zaroori hai)
// Route: GET /api/orders/my-stats
router.get("/my-stats", protect, getUserStats); 

// 4. Admin Only: Saare orders dekhna aur status update karna
router.get("/", protect, authorize("admin"), getOrders);
router.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

export default router;