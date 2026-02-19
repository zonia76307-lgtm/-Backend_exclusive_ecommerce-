import express from "express";
import { createSale, getSales, updateSale, deleteSale } from "../controllers/saleController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSales); // Sab dekh saken
router.post("/", protect, authorize("admin"), createSale); // Admin Only
router.put("/:id", protect, authorize("admin"), updateSale); // Admin Only
router.delete("/:id", protect, authorize("admin"), deleteSale); // Admin Only

export default router;