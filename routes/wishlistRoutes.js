import express from "express";
import { 
  toggleWishlist, 
  getMyWishlist, 
  clearWishlist, 
  removeSingleFromWishlist 
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, toggleWishlist);
router.get("/", protect, getMyWishlist);

// 🔥 FIX: Pehle /clear wala route rakhein
router.delete("/clear", protect, clearWishlist); 

// 🔥 PHIR: ID wala route rakhein
router.delete("/:productId", protect, removeSingleFromWishlist); 

export default router;