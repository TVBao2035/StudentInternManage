import React from "react";
import { formatDate } from "../../../helpers/formatCreatedAt";

const CVDetailModal = ({
  isOpen,
  application,
  onClose,
  onUpdateStatus,
  updating,
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Chi tiết CV ứng tuyển
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Thông tin ứng viên
              </h3>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Họ và tên:</span>{" "}
                {application.user?.name || "Không có thông tin"}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Email:</span>{" "}
                {application.user?.email || "Không có thông tin"}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Số điện thoại:</span>{" "}
                {application.user?.phoneNumber || "Không có thông tin"}
              </p>
              {application.user?.gender !== undefined && (
                <p className="mt-1 text-sm text-gray-900">
                  <span className="font-medium">Giới tính:</span>{" "}
                  {application.user.gender ? "Nam" : "Nữ"}
                </p>
              )}
              {application.user?.schoolName && (
                <p className="mt-1 text-sm text-gray-900">
                  <span className="font-medium">Trường:</span>{" "}
                  {application.user.schoolName}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Thông tin bài đăng tuyển dụng
              </h3>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Vị trí:</span>{" "}
                {application.post?.name || "Không có thông tin"}
              </p>
              {application.post?.experienceYear !== undefined && (
                <p className="mt-1 text-sm text-gray-900">
                  <span className="font-medium">Yêu cầu kinh nghiệm:</span>{" "}
                  {application.post.experienceYear} năm
                </p>
              )}
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Ngày mở tuyển dụng:</span>{" "}
                {application.post?.createdAt
                  ? formatDate(application.post.createdAt)
                  : "Không có thông tin"}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Ngày kết thúc tuyển dụng:</span>{" "}
                {application.post?.exprised
                  ? formatDate(application.post.exprised)
                  : "Không có thông tin"}
              </p>
            </div>
          </div>

          {application.message && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Mô tả bản thân
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-700">
                  {application.message}
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              CV ứng tuyển
            </h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {application.urlCV ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">CV đã tải lên</span>
                  <a
                    href={application.urlCV}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Xem CV
                  </a>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Không có CV</span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Cập nhật trạng thái
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onUpdateStatus(application.id, 1)}
                disabled={updating || application.status === 1}
                className={`px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 transition-colors duration-200 ${
                  updating || application.status === 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Đánh dấu đã xem
              </button>
              <button
                onClick={() => onUpdateStatus(application.id, 2)}
                disabled={updating || application.status === 2}
                className={`px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors duration-200 ${
                  updating || application.status === 2
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Chấp nhận
              </button>
              <button
                onClick={() => onUpdateStatus(application.id, -1)}
                disabled={updating || application.status === -1}
                className={`px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors duration-200 ${
                  updating || application.status === -1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Từ chối
              </button>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVDetailModal;
