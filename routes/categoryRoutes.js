import express from "express";
import multer from "multer";
import path from "path";
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Ensure 'uploads' folder exists in your backend root
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getCategories);

// 'upload.single("image")' frontend se aane wali file ko handle karega
router.post("/", protect, authorize("admin"), upload.single("image"), createCategory);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;