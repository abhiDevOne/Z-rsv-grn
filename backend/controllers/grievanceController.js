import Grievance from "../models/Grievance.js";
import cloudinary from "../utils/cloudinary.js";
import { analyzeGrievance } from "../utils/aiService.js";
import { sendEmail } from "../utils/emailService.js";
import User from "../models/User.js";

// @desc    Create a new grievance
// @route   POST /api/grievances
// @access  Private (Student)
export const createGrievance = async (req, res) => {
  try {
    // Note: When using FormData (files), req.body fields are strings.
    const { title, description, category, isAnonymous } = req.body;

    let evidenceData = {};

    // If a file is included, upload to Cloudinary
    if (req.file) {
      // Convert buffer to base64 string for Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "campus-connect",
      });

      evidenceData = {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      };
    }

    // --- AI ANALYSIS START ---
    // Strip HTML tags from description for the AI (Quill sends HTML)
    const plainTextDescription = description.replace(/<[^>]+>/g, "");

    let aiResult = { priority: "Medium", summary: "" };

    try {
      // Call our new service
      aiResult = await analyzeGrievance(title, plainTextDescription);
    } catch (err) {
      console.log("AI Service skipped due to error");
    }
    // --- AI ANALYSIS END ---

    const grievance = await Grievance.create({
      student: req.user._id,
      title,
      description,
      category,
      isAnonymous: isAnonymous === "true" || isAnonymous === true, // Handle string 'true' from FormData
      evidence: evidenceData,
      priority: aiResult.priority,
      aiSummary: aiResult.summary,
    });

    // Get student details to send email
    const studentUser = await User.findById(req.user._id);

    // Send Email (Fire and Forget - don't await so it doesn't slow down the response)
    const emailHtml = `
      <h2>Grievance Received</h2>
      <p>Hi ${studentUser.name},</p>
      <p>We have received your grievance titled: <strong>"${title}"</strong>.</p>
      <p><strong>Priority:</strong> ${aiResult.priority}</p>
      <p>An officer will review it shortly.</p>
      <p>Track status here: <a href="${process.env.CLIENT_URL}">Student Dashboard</a></p>
    `;

    sendEmail(
      studentUser.email,
      "✅ Grievance Submitted Successfully.",
      emailHtml
    );

    res.status(201).json(grievance);
  } catch (error) {
    console.error("Error creating grievance:", error);
    res.status(500).json({ message: "🔴 Server Error." });
  }
};

// @desc    Get logged-in user's grievances
// @route   GET /api/grievances/my-grievances
// @access  Private (Student)
export const getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "🔴 Server Error." });
  }
};

// @desc    Get ALL grievances (Public Feed + Officer Dashboard)
// @route   GET /api/grievances
// @access  Private
export const getAllGrievances = async (req, res) => {
  try {
    let query = Grievance.find({})
      .populate("student", "name email department")
      .sort({ createdAt: -1 });

    // SECURITY: If the user is a Student, hide internal notes
    if (req.user.role === "student") {
      query = query.select("-internalNotes");
    }

    const grievances = await query;
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "🔴 Server Error." });
  }
};

// @desc    Get Single Grievance Details
// @route   GET /api/grievances/:id
// @access  Private
export const getSingleGrievance = async (req, res) => {
  try {
    let query = Grievance.findById(req.params.id)
      .populate("student", "name email")
      .populate("comments.user", "name role");

    // Security: If student, DO NOT return Internal Notes
    if (req.user.role === "student") {
      query = query.select("-internalNotes");
    }

    const grievance = await query;

    if (!grievance)
      return res.status(404).json({ message: "🔴 Grievance not found." });

    // Security: Ensure student only sees THEIR own grievance
    if (
      req.user.role === "student" &&
      grievance.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "🔴 Not Authorized." });
    }

    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: "🔴 Server Error." });
  }
};

// @desc    Add a comment (Discussion Thread)
// @route   POST /api/grievances/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance)
      return res.status(404).json({ message: "🔴 Grievance not found." });

    // Create Comment
    const comment = {
      user: req.user._id,
      text,
    };

    grievance.comments.push(comment);
    await grievance.save();

    // Return the specific new comment with populated user (for instant UI update)
    // In a real app, we might just return the whole grievance, but this is efficient
    const updatedGrievance = await Grievance.findById(req.params.id).populate(
      "comments.user",
      "name role"
    );

    res.json(updatedGrievance.comments);
  } catch (error) {
    res.status(500).json({ message: "🔴 Server Error." });
  }
};

// @desc    Update Status & Internal Notes
// @route   PUT /api/grievances/:id/status
// @access  Private (Officer/Admin only)
export const updateStatus = async (req, res) => {
  try {
    const { status, internalNotes } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance)
      return res.status(404).json({ message: "🔴 Grievance not found." });

    if (status) grievance.status = status;
    if (internalNotes) grievance.internalNotes = internalNotes;

    await grievance.save();

    // Fetch the student to get their email
    const student = await User.findById(grievance.student);

    if (student) {
      const emailHtml = `
        <h2>Status Update</h2>
        <p>Hi ${student.name},</p>
        <p>The status of your grievance <strong>"${
          grievance.title
        }"</strong> has been updated to:</p>
        <h3 style="color: blue;">${status}</h3>
        <p>Officer Note: <em>${
          internalNotes
            ? "Internal Review Updated"
            : "Status changed by officer."
        }</em></p>
        <br/>
        <p>Log in to view details: <a href="${
          process.env.CLIENT_URL
        }">Resolve App</a></p>
      `;

      sendEmail(student.email, `Status Updated: ${grievance.title}`, emailHtml);
    }

    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: "🔴 Server Error." });
  }
};

// @desc    Upvote/Undo Upvote a Grievance
// @route   PUT /api/grievances/:id/upvote
// @access  Private (Student Only)
export const toggleUpvote = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "🔴 Grievance not found." });
    }

    // Check if already upvoted
    const index = grievance.upvotes.indexOf(req.user._id);

    if (index === -1) {
      // Not upvoted yet -> Add upvote
      grievance.upvotes.push(req.user._id);
    } else {
      // Already upvoted -> Remove upvote (Toggle off)
      grievance.upvotes.splice(index, 1);
    }

    await grievance.save();
    res.json(grievance.upvotes);
  } catch (error) {
    res.status(500).json({ message: "🔴 Server Error." });
  }
};
