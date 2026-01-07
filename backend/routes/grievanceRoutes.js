import express from "express";
import {
  createGrievance,
  getMyGrievances,
  getAllGrievances,
  getSingleGrievance,
  addComment,
  updateStatus,
  toggleUpvote,
} from "../controllers/grievanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Student Routes
// Used verifyToken (protect) here to ensure they are logged in - upload.single("evidence")
router.post("/", protect, upload.single("evidence"), createGrievance);
router.get("/my-grievances", protect, getMyGrievances);

// Admin/Officer Routes
// Add 'authorize' to ensure only specific roles can see ALL tickets
// Allowed students too see Grievance List without sensitive data for UpVote (Access control will be handled inside the controller)
router.get("/", protect, getAllGrievances);

// Get Single Ticket (Anyone involved)
router.get("/:id", protect, getSingleGrievance);

// Add Comment (Student or Officer)
router.post("/:id/comment", protect, addComment);

// Update Status (Officer Only)
router.put("/:id/status", protect, authorize("admin", "officer"), updateStatus);

// Upvote Route
router.put("/:id/upvote", protect, toggleUpvote);

export default router;
