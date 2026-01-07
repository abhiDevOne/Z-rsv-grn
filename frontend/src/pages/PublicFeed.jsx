import { useEffect, useState } from "react";
import { useGrievanceStore } from "../store/grievanceStore";
import { useAuthStore } from "../store/authStore";
import { ThumbsUp, MessageSquare, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const PublicFeed = () => {
  const { grievances, getAllGrievances, upvoteGrievance, isLoading } =
    useGrievanceStore();
  const { authUser } = useAuthStore();
  const [sortBy, setSortBy] = useState("latest"); // 'latest' or 'votes'

  useEffect(() => {
    getAllGrievances(); // Fetch all
  }, [getAllGrievances]);

  const publicGrievances = grievances;

  // Sort Logic
  const sortedGrievances = [...publicGrievances].sort((a, b) => {
    if (sortBy === "votes") {
      return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Community Feed
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            See what others are reporting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none dark:text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="votes">Most Upvoted</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedGrievances.map((ticket) => {
          const isUpvoted = ticket.upvotes?.includes(authUser._id);

          return (
            <div
              key={ticket._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => upvoteGrievance(ticket._id)}
                    className={`p-2 rounded-lg transition ${
                      isUpvoted
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <ThumbsUp
                      size={20}
                      fill={isUpvoted ? "currentColor" : "none"}
                    />
                  </button>
                  <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                    {ticket.upvotes?.length || 0}
                  </span>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {ticket.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${
                        ticket.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                    Posted by{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-200">
                      {ticket.isAnonymous
                        ? "Anonymous Student"
                        : ticket.student?.name}
                    </span>{" "}
                    • {ticket.category}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <Link
                      to={`/grievance/${ticket._id}`}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View Discussion
                    </Link>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <MessageSquare size={16} />
                      {ticket.comments?.length || 0} comments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicFeed;
