import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createTask } from "../../../api/taskAPI";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../helpers/NotificationToast";

const CreateInternJobModal = ({ isOpen, onClose, onSubmit, assignmentId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    notice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      showErrorToast("Title cannot be blank!");
      return;
    }

    if (!assignmentId) {
      showErrorToast("No assignment information found!");
      return;
    }

    try {
      setLoading(true);
      onSubmit(formData);
      setFormData({ title: "", notice: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorToast("Connect error!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-blue-600 tracking-wide">
            Thêm công việc mới
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
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên công việc"
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
                value={formData.notice}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Nhập ghi chú cho công việc"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-5 py-2.5 text-white font-medium rounded-lg ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors shadow-sm hover:shadow`}
          >
            {loading ? "Đang xử lý..." : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInternJobModal;
