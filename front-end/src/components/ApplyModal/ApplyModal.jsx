import React, { useState } from "react";
import { X, Upload, Send } from "lucide-react";

const ApplyModal = ({ isOpen, onClose, onSubmit, jobTitle }) => {
  const [formData, setFormData] = useState({
    introduction: "",
    cv: null,
  });
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFormData({
        ...formData,
        cv: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8 relative shadow-2xl transform transition-all animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200"
        >
          <X size={20} />
        </button>

        <div className="mb-8"></div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="introduction"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Giới thiệu về bản thân
              </label>
              <textarea
                id="introduction"
                name="introduction"
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                value={formData.introduction}
                onChange={handleChange}
                placeholder="Viết giới thiệu ngắn gọn về bản thân..."
              />
            </div>

            <div>
              <label
                htmlFor="cv"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                CV của bạn
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <div className="w-full flex">
                  <div className="flex-grow">
                    <div className="border border-gray-300 rounded-l-xl px-4 py-3 bg-gray-50 text-gray-500 w-full truncate">
                      {fileName || "Chưa chọn file nào"}
                    </div>
                  </div>
                  <label
                    htmlFor="cv"
                    className="cursor-pointer px-4 py-3 bg-blue-50 text-blue-600 font-medium rounded-r-xl border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200 flex items-center"
                  >
                    <Upload size={18} className="mr-2" /> Chọn
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Định dạng được hỗ trợ: PDF, DOC, DOCX
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 transform flex items-center justify-center"
              >
                <Send size={18} className="mr-2" /> Gửi đơn ứng tuyển
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
