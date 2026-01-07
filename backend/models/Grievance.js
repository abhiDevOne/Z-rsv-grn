import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true }, // Will hold HTML from React Quill
    category: {
      type: String,
      enum: ["Academic", "Infrastructure", "Harassment", "Cafeteria", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    aiSummary: { type: String }, // The 1-sentence summary
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isAnonymous: { type: Boolean, default: false },
    evidence: {
      public_id: { type: String },
      url: { type: String },
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Internal notes for officers (Hidden from students)
    internalNotes: { type: String },
  },
  { timestamps: true }
);

const Grievance = mongoose.model("Grievance", grievanceSchema);
export default Grievance;
