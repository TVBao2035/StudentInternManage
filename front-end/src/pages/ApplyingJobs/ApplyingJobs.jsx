import Reac, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import JobAppItem from "../../components/JobAppItem";

const ApplyingJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
        setLoading(true);
        try {
            const mockApplications = [
                {
                    id: 1,
                    jobTitle: "Tuyển dụng Vue JS",
                    appliedDate: "2025-03-01T00:00:00.000Z",
                    status: "PENDING",
                },
                {
                    id: 2,
                    jobTitle: "Tuyển dụng PHP",
                    appliedDate: "2025-03-21T00:00:00.000Z",
                    status: "VIEWED",
                },
                {
                    id: 3,
                    jobTitle: "Tuyển dụng React",
                    appliedDate: "2025-03-25T00:00:00.000Z",
                    status: "REJECTED",
                },
                {
                    id: 4,
                    jobTitle: "Tuyển dụng Node JS",
                    appliedDate: "2025-03-27T00:00:00.000Z",
                    status: "ACCEPTED",
                },
            ];

            setApplications(mockApplications);
            setFilteredApplications(mockApplications);

        } catch (error) {
            console.error("Error fetching applications:", error);
            setError("Failed to fetch applications. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    fetchApplications();
  }, [] );
  const handleViewDetails = () => {};
  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Công việc đã ứng tuyển
          </h1>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <JobAppItem
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              Bạn chưa ứng tuyển công việc nào
            </p>
            <p className="text-gray-400 mt-2">
              Khám phá các cơ hội việc làm mới và bắt đầu ứng tuyển ngay
            </p>
            <button
              onClick={() => navigate("/tim-viec")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Tìm việc ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyingJobs;