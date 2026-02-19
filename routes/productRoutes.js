import express from "express";
import multer from "multer";
import path from "path";
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  getFlashSales,
  getNewArrivals,
  getBestSelling // ✅ Import Best Selling
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// --- ROUTES ---

// Public Routes
router.get("/", getProducts);
router.get("/flash-sales", getFlashSales);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-selling", getBestSelling); // ✅ New Endpoint
router.get("/:id", getProductById);

// Admin Only Routes
router.post("/", protect, authorize("admin"), upload.single("image"), createProduct); 
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateProduct); 
router.delete("/:id", protect, authorize("admin"), deleteProduct); 

export default router;