import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGrievanceStore } from "../store/grievanceStore";
import { Search, Filter, Loader } from "lucide-react";

const OfficerDashboard = () => {
  const { grievances, getAllGrievances, isLoading } = useGrievanceStore();
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    getAllGrievances();
  }, [getAllGrievances]);

  // Calculate Stats
  const stats = {
    total: grievances.length,
    pending: grievances.filter((g) => g.status === "Pending").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
  };

  // Filter Logic
  const filteredGrievances = grievances.filter((g) => {
    if (filterStatus === "All") return true;
    return g.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Grievance Overview
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Manage and track campus issues
        </div>
      </div>

      {/* Stats Cards - Added Dark Mode Classes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Grievances
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Pending Review
          </p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Resolved</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-500">
            {stats.resolved}
          </p>
        </div>
      </div>

      {/* Filters & Table - Added Dark Mode Classes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by student or title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500 dark:text-gray-400" />
            <select
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <Loader className="mx-auto animate-spin text-blue-600" />
                  </td>
                </tr>
              ) : filteredGrievances.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No grievances found.
                  </td>
                </tr>
              ) : (
                filteredGrievances.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4">{ticket.category}</td>
                    <td className="px-6 py-4">
                      {ticket.isAnonymous ? (
                        <span className="italic text-gray-400">Anonymous</span>
                      ) : (
                        ticket.student?.name || "Unknown"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          ticket.priority === "High"
                            ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                            : ticket.priority === "Medium"
                            ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"
                            : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                        }`}
                      >
                        {ticket.priority || "Medium"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/grievance/${ticket._id}`}
                        className="text-blue-600 hover:text-blue-400 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
