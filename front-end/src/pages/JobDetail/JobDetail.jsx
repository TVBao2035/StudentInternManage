import React, { useState, useEffect } from "react";
import { FileText, Award, Briefcase, Gift } from "lucide-react";
import ApplyModal from "../../components/ApplyModal";

const JobDetail = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const mockJob = {
      id: 1,
      title: "Tuyển dụng React JS",
      requirements: "React js, Redux, Fluent English",
      experience: "Không",
      position: "Front-end",
      benefits: [
        "- Chỉ phí hỗ trợ thực tập",
        "- Cơ hội huấn luyện, đào tạo chuyên môn nâng cao nghiệp vụ và kỹ thuật.",
        "- Đồng nghiệp, môi trường làm việc hiện đại, năng động, thân thiện và cởi mở.",
        "- Các hoạt động như team building gắn kết thành viên, nghỉ mát hàng năm và sự kiện nội bộ tại công ty, hội nhóm thể thao như cầu lông, đá banh,...",
        "- Thời gian làm việc: 8.00 AM 17.30 PM, Thứ 2 Thứ 6, Nghỉ hàng tuần Thứ 7 & Chủ nhật.",
      ],
    };

    setTimeout(() => {
      setJobDetails(mockJob);
      setLoading(false);
    }, 300);
  }, []);

  const handleApply = () => {
    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
  };

  const handleSubmitApplication = (formData) => {
    console.log("Application submitted:", formData);
    setShowApplyModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 border-opacity-90 shadow-xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 ease-in-out">
        <div className="mb-10 border-b pb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-6 tracking-wide">
            {jobDetails.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-end">
            <button
              onClick={handleApply}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-200/50 hover:shadow-2xl active:scale-95 transform"
            >
              Ứng tuyển
            </button>
          </div>
        </div>

        <div className="grid gap-y-8">
          <JobSection
            icon={<FileText className="w-6 h-6 text-blue-600" />}
            title="Yêu cầu:"
            content={jobDetails.requirements}
          />

          <JobSection
            icon={<Award className="w-6 h-6 text-blue-600" />}
            title="Kinh nghiệm:"
            content={jobDetails.experience}
          />

          <JobSection
            icon={<Briefcase className="w-6 h-6 text-blue-600" />}
            title="Vị trí:"
            content={jobDetails.position}
          />

          <JobSection
            icon={<Gift className="w-6 h-6 text-blue-600" />}
            title="Quyền lợi:"
            content={
              <div className="space-y-3">
                {jobDetails.benefits.map((benefit, index) => (
                  <p
                    key={index}
                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200 pl-4 border-l-2 border-blue-100 hover:border-blue-500"
                  >
                    {benefit}
                  </p>
                ))}
              </div>
            }
          />
        </div>
      </div>
      <ApplyModal
        isOpen={showApplyModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitApplication}
        jobTitle={jobDetails?.title}
      />
    </div>
  );
};

const JobSection = ({ icon, title, content }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start group">
    <div className="font-semibold text-gray-900 flex items-center space-x-4">
      <div className="transition-all duration-300 transform group-hover:scale-110 group-hover:text-blue-600">
        {icon}
      </div>
      <span className="group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </span>
    </div>
    <div className="col-span-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
      {typeof content === "string" ? content : content}
    </div>
  </div>
);

export default JobDetail;
