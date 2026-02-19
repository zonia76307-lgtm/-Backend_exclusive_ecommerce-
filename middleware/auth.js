import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User dhoondo (decoded.id wahi hai jo login mein sign kiya tha)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User nahi mila" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token galat hai" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Token nahi mila, login karein" });
  }
};

// Admin check karne ke liye logic
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Sirf Admin ye kar sakta hai" });
    }
    next();
  };
};