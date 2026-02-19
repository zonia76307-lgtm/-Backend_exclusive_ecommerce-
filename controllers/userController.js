import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// --- Helper: Send Email ---
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  const mailOptions = {
    from: `"Exclusive Shop" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};

// --- 1. SIGNUP ---
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(32).toString("hex");
    
    const user = await User.create({ name, email, password: hashedPassword, emailToken });
    const verifyUrl = `http://localhost:5000/api/users/verify-email/${emailToken}`;
    
    await sendEmail({ email: user.email, subject: "Verify Your Account", message: `Verify here: ${verifyUrl}` });
    res.status(201).json({ message: "Signup successful, check email!" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// --- 2. VERIFY EMAIL ---
export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.params.token });
    if (!user) return res.status(400).json({ message: "Invalid token" });
    user.isVerified = true;
    user.emailToken = undefined;
    await user.save();
    res.redirect(`http://localhost:5173/verify-success`);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// --- 3. LOGIN ---
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ message: "Please verify email first" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    res.json({ 
      token, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      _id: user._id 
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// --- 4. UPDATE PROFILE (FOR USER DASHBOARD) ---
export const updateUserProfile = async (req, res) => {
  try {
    // req.user._id authentication middleware (protect) se aata hai
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      // Email update optional hai, agar aap allow karna chahen:
      // user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
      }

      const updatedUser = await user.save();

      // Naya token generate karna zaroori hai agar role ya id change ho (optional here)
      const token = jwt.sign({ id: updatedUser._id, role: updatedUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: token, // Frontend ko naya data bhej rahe hain
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 5. FORGOT PASSWORD ---
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();
    
    await sendEmail({ email: user.email, subject: "OTP", message: `Your OTP: ${otp}` });
    res.json({ message: "OTP sent" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// --- 6. RESET PASSWORD ---
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body; 
    const user = await User.findOne({ email, resetPasswordToken: otp, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid OTP" });
    
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: "Success" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// --- 7. ADMIN: GET ALL USERS ---
export const getAllUsers = async (req, res) => {
  try { const users = await User.find({}).select("-password"); res.json(users); } catch (e) { res.status(500).json({ message: e.message }); }
};

// --- 8. ADMIN: DELETE USER ---
export const deleteUser = async (req, res) => {
  try { await User.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json({ message: e.message }); }
};

// --- 9. ADMIN: UPDATE USER ROLE ---
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) { 
      user.role = req.body.role || user.role; 
      await user.save(); 
      res.json({ message: "Updated", user }); 
    } else { 
      res.status(404).json({ message: "Not found" }); 
    }
  } catch (e) { res.status(500).json({ message: e.message }); }
};