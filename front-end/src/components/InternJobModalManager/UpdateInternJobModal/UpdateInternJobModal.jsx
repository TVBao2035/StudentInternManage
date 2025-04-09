import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const UpdateInternJobModal = ({ isOpen, onClose, onSubmit, job }) => {
  const [jobData, setJobData] = useState({
    title: "",
    notice: "",
  });

  // Cập nhật state khi job thay đổi
  useEffect(() => {
    if (job) {
      setJobData({
        title: job.title || "",
        notice: job.notice || "",
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Kiểm tra dữ liệu trước khi submit
    if (!jobData.title.trim()) {
      return; // Không cho phép tiêu đề trống
    }

    onSubmit({
      ...job,
      title: jobData.title,
      notice: jobData.notice,
    });

    onClose();
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-blue-600 tracking-wide">
            Chỉnh sửa
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tên công việc
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="notice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ghi chú
              </label>
              <textarea
                id="notice"
                name="notice"
                value={jobData.notice}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-y-auto"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transform hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInternJobModal;
