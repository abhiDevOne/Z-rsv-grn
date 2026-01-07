import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGrievanceStore } from "../store/grievanceStore";
import { useAuthStore } from "../store/authStore";
import { ArrowLeft, Send, Clock, User, Shield, Lock } from "lucide-react";
import ReactQuill from "react-quill-new";

const SingleGrievance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    selectedGrievance,
    getGrievanceById,
    addComment,
    updateStatus,
    isLoading,
  } = useGrievanceStore();

  const [commentText, setCommentText] = useState("");
  const [status, setStatus] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const isOfficer = authUser.role === "officer" || authUser.role === "admin";

  useEffect(() => {
    getGrievanceById(id);
  }, [id, getGrievanceById]);

  useEffect(() => {
    if (selectedGrievance) {
      setStatus(selectedGrievance.status);
      setInternalNotes(selectedGrievance.internalNotes || "");
    }
  }, [selectedGrievance]);

  const handleStatusUpdate = () => {
    updateStatus(id, status, internalNotes);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(id, commentText);
    setCommentText("");
  };

  if (isLoading || !selectedGrievance)
    return <div className="p-10 text-center dark:text-white">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: The Issue Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedGrievance.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium 
                ${
                  selectedGrievance.status === "Resolved"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : selectedGrievance.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                }`}
              >
                {selectedGrievance.status}
              </span>
            </div>

            {/* AI Summary Badge (Fixed for Dark Mode) */}
            {selectedGrievance.aiSummary && (
              <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 p-3 rounded-lg flex gap-3 items-start">
                <span className="text-xs font-bold bg-purple-600 text-white px-2 py-0.5 rounded uppercase shrink-0 mt-0.5">
                  AI Summary
                </span>
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  {selectedGrievance.aiSummary}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                {new Date(selectedGrievance.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                {selectedGrievance.isAnonymous
                  ? "Anonymous Student"
                  : selectedGrievance.student?.name}
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                {selectedGrievance.category}
              </div>
            </div>

            {/* Description (Read Only) */}
            <div className="prose max-w-none text-gray-800 dark:text-gray-200 dark:prose-invert">
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedGrievance.description,
                }}
              />
            </div>

            {/* Evidence Image */}
            {selectedGrievance.evidence?.url && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Attached Evidence
                </h3>
                <div className="relative h-64 w-full sm:w-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <img
                    src={selectedGrievance.evidence.url}
                    alt="Grievance Evidence"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Discussion Thread */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Discussion
            </h3>

            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {selectedGrievance.comments?.length === 0 && (
                <p className="text-gray-400 text-center italic">
                  No comments yet.
                </p>
              )}
              {selectedGrievance.comments?.map((comment, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    comment.user._id === authUser._id ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                    ${
                      comment.user.role === "student"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                        : "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
                    }`}
                  >
                    {comment.user.name[0]}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm
                    ${
                      comment.user._id === authUser._id
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none"
                    }`}
                  >
                    <p className="font-bold text-xs opacity-75 mb-1">
                      {comment.user.name} ({comment.user.role})
                    </p>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleCommentSubmit} className="relative">
              <input
                type="text"
                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                placeholder="Type your reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Panel (Officer Only) */}
        {isOfficer && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <div className="flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-400 font-semibold">
                <Shield size={20} />
                Officer Actions
              </div>

              {/* Status Updater */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Update Status
                </label>
                <select
                  className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Internal Notes */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Internal Notes
                  </label>
                  <Lock size={12} className="text-gray-400" />
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg h-32 text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Private notes for other officers..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                ></textarea>
                <p className="text-xs text-gray-400 italic">
                  Visible only to officers.
                </p>
              </div>

              <button
                onClick={handleStatusUpdate}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleGrievance;
