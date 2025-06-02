import React from "react";
import { formatDate } from "../../../helpers/formatCreatedAt";
import { LoadingSpinner, ErrorMessage } from "../../Common";

const JobApplicationsTable = ({ applications, onViewDetail, loading, error }) => {

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Đã gửi";
      case 1:
        return "Đã xem";
      case 2:
        return "Đã chấp nhận";
      case -1:
        return "Đã từ chối";
      default:
        return "Không xác định";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "bg-blue-100 text-blue-800";
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-green-100 text-green-800";
      case -1:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} fullWidth={true} className="py-12 mt-4" />
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500 text-lg">
          Không có CV ứng tuyển nào
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ứng viên
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bài đăng ứng tuyển
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày ứng tuyển
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((application) => (
            <tr key={application.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {application.user?.name || "Không có tên"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.user?.email || "Không có email"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{application.post?.name || "Không xác định"}</div>
                {/* <div className="text-sm text-gray-500">{application.post?.context?.substring(0, 50) || "Không có mô tả"}{application.post?.context?.length > 50 ? "..." : ""}</div> */}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{application.createdAt ? formatDate(application.createdAt) : "Không xác định"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(application.status)}`}>
                  {getStatusText(application.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onViewDetail(application)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobApplicationsTable;