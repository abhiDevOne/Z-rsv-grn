import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGrievanceStore } from "../store/grievanceStore";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { Paperclip, X } from "lucide-react";

const GrievanceForm = () => {
  const navigate = useNavigate();
  const { createGrievance, isLoading } = useGrievanceStore();

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Academic",
    description: "",
    isAnonymous: false,
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate that description isn't just empty HTML tags
    if (formData.description.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      return alert("Please enter a description");
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("isAnonymous", formData.isAnonymous);
    if (file) {
      data.append("evidence", file);
    }

    createGrievance(data, navigate);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Submit a New Grievance
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please provide detailed information to help us resolve your issue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Subject / Title
            </label>
            <input
              type="text"
              placeholder="e.g., WiFi not working in Library"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="Academic">Academic (Grades, Faculty, etc.)</option>
              <option value="Infrastructure">
                Infrastructure (WiFi, Furniture, Labs)
              </option>
              <option value="Cafeteria">Cafeteria / Food Quality</option>
              <option value="Harassment">Harassment / Disciplinary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Rich Text Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="h-64 mb-12">
              {" "}
              {/* Height wrapper for Quill */}
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                className="h-5/6"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2 mt-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Evidence (Image)
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700">
                <Paperclip size={18} />
                {file ? "Change File" : "Attach Image"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              {file && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-blue-800 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">Max 5MB (JPG, PNG)</p>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center space-x-3 pt-4">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.isAnonymous}
              onChange={(e) =>
                setFormData({ ...formData, isAnonymous: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="anonymous"
              className="text-sm text-gray-700 select-none"
            >
              Submit Anonymously (Hide my name from the officer)
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Grievance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrievanceForm;
