import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import JobAppItem from "../../components/JobAppItem";
import { useJobAPI } from "../../hooks/useJobAPI";
import { mapStatusToFrontend } from "../../helpers/statusMapper";

const ApplyingJobs = () => {
  const { jobApplications, loading, error, fetchJobApplications } = useJobAPI();
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

   useEffect(() => {
    if (jobApplications && jobApplications.length > 0) {
      const formattedData = jobApplications.map(app => ({
        id: app.id,
        jobTitle: app.post?.name || "Không xác định",
        appliedDate: app.createdAt || "Không xác định",
        status: mapStatusToFrontend(app.status)
      }));

      if (statusFilter === "ALL") {
        setFilteredApplications(formattedData);
      } else {
        setFilteredApplications(formattedData.filter(app => app.status === statusFilter));
      }
    } else {
      setFilteredApplications([]);
    }
  }, [jobApplications, statusFilter]);

  const handleViewDetails = (applicationId) => {
    navigate(`/job-detail?id=${applicationId}`);
  };

  const handleRefresh = () => {
    fetchJobApplications();
  };

 return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Công việc đã ứng tuyển
          </h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              title="Làm mới"
              disabled={loading}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Lọc theo trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">Đang chờ</option>
                <option value="VIEWED">Đã xem</option>
                <option value="ACCEPTED">Đã chấp nhận</option>
                <option value="REJECTED">Bị từ chối</option>
              </select>
            </div>
          </div>
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
              {statusFilter === "ALL" 
                ? "Bạn chưa ứng tuyển công việc nào" 
                : "Không có công việc nào ở trạng thái này"}
            </p>
            <p className="text-gray-400 mt-2">
              Khám phá các cơ hội việc làm mới và bắt đầu ứng tuyển ngay
            </p>
            <button
              onClick={() => navigate("/")}
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