import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGrievanceStore } from "../store/grievanceStore";
import { Plus, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";

const StudentDashboard = () => {
  const { grievances, getMyGrievances, isLoading } = useGrievanceStore();

  useEffect(() => {
    getMyGrievances();
  }, [getMyGrievances]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Grievances
          </h1>
          <p className="text-gray-500">
            Track the status of your reported issues
          </p>
        </div>
        <Link
          to="/submit-grievance"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition shadow-sm"
        >
          <Plus size={20} />
          Report New Issue
        </Link>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-blue-600" size={32} />
        </div>
      ) : grievances.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="text-gray-400" size={24} />
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No grievances found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You haven't reported any issues yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {grievances.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white dark:bg-gray-800 dark:border-gray-700 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                {ticket.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{ticket.category}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  {ticket.isAnonymous ? "Anonymous" : "Public"}
                </span>
                <Link
                  to={`/grievance/${ticket._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
