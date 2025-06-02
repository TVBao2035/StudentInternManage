import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Award, Gift } from "lucide-react";
import { ApplicationButton, ApplyModal } from "../../components/Application";
import { useJobAPI } from "../../hooks/useJobAPI";
import { usePostAPI } from "../../hooks/usePostAPI";
import { LoadingSpinner, ErrorMessage } from "../../components/Common";

const PostDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const postId = searchParams.get("id");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const {
    postDetail,
    loading: postLoading,
    error: postError,
    fetchPostDetail,
  } = usePostAPI();

  const {
    applyForJob,
    fetchJobApplications,
    isAuthenticated,
    loading: jobLoading,
    error: jobError,
  } = useJobAPI(postId);

  useEffect(() => {
    if (postId) {
      fetchPostDetail(postId);
    }
  }, [postId]);

  const handleApply = () => {
    if (!isAuthenticated) {
      localStorage.setItem(
        "redirectAfterLogin",
        location.pathname + location.search
      );
      navigate("/login");
      return;
    }

    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
  };

  const handleSubmitApplication = async (applicationData) => {
    try {
      const result = await applyForJob(applicationData);

      if (result.success) {
        setShowApplyModal(false);
      }
    } catch (error) {
      console.error("Error when submitting application:", error);
    }
  };

  const formattedExperience =
    postDetail && typeof postDetail.experienceYear === "number"
      ? postDetail.experienceYear === 0
        ? "Không yêu cầu"
        : `${postDetail.experienceYear} năm`
      : "Không yêu cầu";

  const requirements =
    postDetail && postDetail.technologies && postDetail.technologies.length > 0
      ? postDetail.technologies.map((tech) => tech.name).join(", ")
      : "Không có yêu cầu cụ thể";

  const contextContent =
    postDetail && typeof postDetail.context === "string"
      ? postDetail.context
      : "Không có mô tả chi tiết";

  if (postLoading) {
    return <LoadingSpinner />;
  }

  if (postError) {
    return (
      <ErrorMessage
        message={postError}
        fullWidth={true}
        showIcon={true}
        className="py-12 mt-4"
      />
    );
  }

  if (!postDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 mt-4 text-center">
        <p className="text-gray-600 text-lg">
          Không tìm thấy thông tin bài đăng tuyển.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-4">
      {jobError && <ErrorMessage message={jobError} className="mb-4" />}

      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 ease-in-out">
        <div className="mb-10 border-b pb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-6 tracking-wide">
            {postDetail.name}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-end">
            <ApplicationButton postId={postDetail.id} onApply={handleApply} />
          </div>
        </div>

        <div className="grid gap-y-8">
          <JobSection
            icon={<FileText className="w-6 h-6 text-blue-600" />}
            title="Yêu cầu:"
            content={requirements}
          />

          <JobSection
            icon={<Award className="w-6 h-6 text-blue-600" />}
            title="Kinh nghiệm:"
            content={formattedExperience}
          />

          <JobSection
            icon={<Gift className="w-6 h-6 text-blue-600" />}
            title="Quyền lợi:"
            content={postDetail.context}
          />
        </div>
      </div>

      <ApplyModal
        isOpen={showApplyModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitApplication}
        jobTitle={postDetail?.name}
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

export default PostDetail;
