import express from "express";
import { 
  addToCart, 
  getCart, 
  updateQuantity, 
  removeItem,
  clearCart // 🔥 Ye function import hona zaroori hai
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// 1. DELETE: Sab se pehle specific routes rakhte hain (Clear Cart)
// Ye wo route hai jo Checkout page hit karega database saaf karne ke liye
router.delete("/clear", protect, clearCart); 

// 2. GET: Cart ki list dekhna | POST: Naya item add karna
router.route("/")
  .get(protect, getCart)
  .post(protect, addToCart);

// 3. PUT: Quantity badalna
router.put("/update", protect, updateQuantity);

// 4. DELETE: Single item remove karna
router.delete("/:id", protect, removeItem);

export default router;