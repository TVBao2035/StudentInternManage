import React from "react";
import { FileEdit, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AssignmentCard = ({ assignment, onDelete, onUpdateScore }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/assignment-details/${assignment.id}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between gap-3">
        <div className="flex-1 mb-2 lg:mb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700">
                Thực tập sinh:
              </h3>
              <p className="text-base font-medium text-blue-600">
                {assignment.intern?.user?.name || "Chưa xác định"}
              </p>
              <p className="text-xs text-gray-500">
                {assignment.intern?.user?.email || ""}
              </p>
            </div>

            <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full shadow-sm">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-bold text-base">
                {assignment.score !== null ? assignment.score : "-"}
              </span>
              <span className="text-xs text-gray-600 ml-1">/10</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 rounded-lg p-2.5 shadow-inner">
          <h3 className="text-sm font-semibold text-gray-700">
            Người hướng dẫn:
          </h3>
          <p className="text-base font-medium text-blue-600">
            {assignment.mentor?.user?.name || "Chưa xác định"}
          </p>
          <p className="text-xs text-gray-500">
            {assignment.mentor?.user?.email || ""}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-3 space-x-2">
        <button
          onClick={() => onUpdateScore(assignment)}
          className="flex items-center px-2.5 py-1 text-sm bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 transition-colors border border-yellow-200"
          title="Cập nhật điểm"
        >
          <Star className="h-3.5 w-3.5 mr-1" />
          <span>Chấm điểm</span>
        </button>
        <button
          onClick={handleViewDetails}
          className="flex items-center px-2.5 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
          title="Xem chi tiết"
        >
          <FileEdit className="h-3.5 w-3.5 mr-1" />
          <span>Chi tiết</span>
        </button>
        <button
          onClick={() => onDelete(assignment.id)}
          className="flex items-center px-2.5 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors border border-red-200"
          title="Xóa phân công"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          <span>Xóa</span>
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
