import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 1. Protect routes (Verify Token)
export const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and attach to request (exclude password)
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "❌ Not Authorized, Invalid Token." });
    }
  } else {
    res.status(401).json({ message: "❌ Not Authorized, No Token." });
  }
};

// 2. Role-Based Access Control (RBAC)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `👤 User role: '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};
