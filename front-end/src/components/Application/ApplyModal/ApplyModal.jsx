import React, { useState } from "react";
import { X, Upload, Send, FileText } from "lucide-react";
import apiUploadCV from "../../../hooks/apiUploadCV";

const ApplyModal = ({ isOpen, onClose, onSubmit, jobTitle }) => {
  const [formData, setFormData] = useState({
    introduction: "",
    cv: null,
    cvUrl: ""
  });

  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File is too large. Please select a file under 10MB!");
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Only PDF, DOC, and DOCX files are supported.");
        return;
      }

      setFileName(file.name);
      setFormData(prev => ({
        ...prev,
        cv: file,
      }));
      setUploadError("");

      setUploading(true);
      try {
        const uploadResult = await apiUploadCV(file);
        
        if (uploadResult.success) {
          setFormData(prev => ({
            ...prev,
            cvUrl: uploadResult.url
          }));
        } else {
          setUploadError("Error uploading CV. Please try again.");
        }
      } catch (error) {
        setUploadError("Error uploading CV. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cvUrl) {
      setUploadError("Vui lòng chọn và tải CV lên trước khi gửi đơn.");
      return;
    }

    onSubmit({
      introduction: formData.introduction,
      cvUrl: formData.cvUrl
      });
  };

  const resetForm = () => {
    setFormData({
      introduction: "",
      cv: null,
      cvUrl: ""
    });
    setFileName("");
    setUploadError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8 relative shadow-2xl transform transition-all animate-scaleIn">
        <button
          onClick={handleClose}
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
                required
              />
            </div>

            <div>
              <label
                htmlFor="cv"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                CV của bạn <span className="text-red-500">*</span>
              </label>

              {uploadError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {uploadError}
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  disabled={uploading}
                />

                 <div className="w-full flex">
                  <div className="flex-grow">
                    <div className={`border border-gray-300 rounded-l-xl px-4 py-3 w-full truncate ${
                      uploading ? 'bg-blue-50' : 'bg-gray-50'
                    } ${formData.cvUrl ? 'text-green-700' : 'text-gray-500'}`}>
                      {uploading ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent mr-2"></div>
                          <span>Đang tải lên...</span>
                        </div>
                      ) : formData.cvUrl ? (
                        <div className="flex items-center">
                          <FileText size={16} className="mr-2 text-green-600" />
                          <span>{fileName} ✓</span>
                        </div>
                      ) : (
                        "Chưa chọn file nào"
                      )}
                    </div>
                  </div>
                  
                  <label
                    htmlFor="cv"
                    className={`cursor-pointer px-4 py-3 font-medium rounded-r-xl border transition-colors duration-200 flex items-center ${
                      uploading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                        : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                    }`}
                  >
                    <Upload size={18} className="mr-2" /> 
                    {uploading ? "Đang tải..." : "Chọn"}
                  </label>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Định dạng được hỗ trợ: PDF, DOC, DOCX (Tối đa 10MB)
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!formData.cvUrl || uploading}
                className={`w-full py-3 font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 transform flex items-center justify-center ${
                  !formData.cvUrl || uploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                <Send size={18} className="mr-2" /> 
                {uploading ? "Đang tải CV..." : "Gửi đơn ứng tuyển"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
