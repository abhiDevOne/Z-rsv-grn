import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Joi from "joi";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    // 1. Joi Validation
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid("student", "admin", "officer"), // Optional, defaults to student
      department: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role, department } = req.body;

    // 2. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "🔴 User already exists." });
    }

    // 3. Create User
    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      department,
    });

    if (user) {
      generateToken(res, user._id); // Set cookie
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "❌ Invalid user data." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "🔴 Server Error." });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id); // Set cookie
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "❌ Invalid email or password." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "🔴 Server Error." });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production", // Must be true in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Must be "none" for cross-site
  });
  res.status(200).json({ message: "🟢 Logged out successfully." });
};

// @desc    Check if user is logged in
// @route   GET /api/auth/check
// @access  Private
export const checkAuth = (req, res) => {
  // The 'protect' middleware has already verified the token and attached the user to req.user
  res.json(req.user);
};

// @desc    Update User Profile (Name & Password)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      // user.email = req.body.email || user.email; // Usually we don't allow email changes easily

      // Password Change Logic
      if (req.body.password) {
        // If changing password, require current password for security
        if (!req.body.currentPassword) {
          return res.status(400).json({
            message: "🟠 Current password is required to set a new one.",
          });
        }

        // Verify current password
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "🔴 Incorrect current password." });
        }

        // Set new password (pre-save hook will hash it)
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "❌ User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "🔴 Server Error." });
  }
};
