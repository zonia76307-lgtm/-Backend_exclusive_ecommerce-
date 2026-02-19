import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  signupUser, verifyEmail, loginUser, forgotPassword, resetPassword,
  getAllUsers, deleteUser, updateUserRole, 
  updateUserProfile // 👈 Naya function import kiya
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// --- Auth Routes ---
router.post("/signup", signupUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword); 

// --- User Profile Route (Dashboard ke liye) ---
// Ismein sirf 'protect' chahiye taake logged-in user access kar sakay
router.put("/profile", protect, updateUserProfile); 

// --- Admin CRUD Routes ---
router.get("/", protect, authorize("admin"), getAllUsers);
router.route("/:id")
  .delete(protect, authorize("admin"), deleteUser)
  .put(protect, authorize("admin"), updateUserRole);

// --- Google OAuth ---
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login", session: false }), 
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);

export default router;