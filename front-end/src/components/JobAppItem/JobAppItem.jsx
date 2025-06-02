import React from "react";
import { formatDate } from "../../helpers/formatCreatedAt";
import { getStatusColorClass, getStatusText } from "../../helpers/statusMapper";

const JobAppItem = ({ application, onViewDetails }) => {
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4">
          <h3 className="text-lg font-semibold text-blue-600">
            {application.jobTitle}
          </h3>
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Ngày ứng tuyển: {formatDate(application.appliedDate)}
          </p>
        </div>

        <div className="md:col-span-1 text-right md:text-left">
          <span className="text-sm text-gray-700 font-medium">Trạng thái:</span>
        </div>

        <div className="md:col-span-5">
          <span
            className={`text-sm font-medium ${getStatusColorClass(
              application.status
            )}`}
          >
            {getStatusText(application.status)}
          </span>
        </div>

        <div className="md:col-span-2 text-right">
          <button
            onClick={() => onViewDetails(application.id)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobAppItem;