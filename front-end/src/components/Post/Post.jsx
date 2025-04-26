import React from "react";
import { Code, ArrowUpRight, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Post = ({ job, onApply }) => {
  const { id, title, requirements, experience, postedTime } = job;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.email;

  const requirementsArray = Array.isArray(requirements)
    ? requirements.map((tech) => tech.name)
    : typeof requirements === "string"
    ? requirements.split(",").map((item) => item.trim())
    : [];

  const formattedDate = postedTime
    ? new Date(postedTime).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const formattedExperience =
    typeof experience === "number"
      ? `${experience} năm`
      : experience || "Không yêu cầu";

  const handleApplyClick = () => {
    if (isAuthenticated) {
      navigate(`/job-detail?id=${id}`);
    } else {
      localStorage.setItem("redirectAfterLogin", `/job-detail?id=${id}`);
      navigate("/login");
    }
  };

  return (
    <div className="w-full max-w-4xl h-61 mx-auto bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 px-6 py-5 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -translate-y-12 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
        <div className="absolute bottom-5 right-12 w-12 h-12 bg-white opacity-5 rounded-full"></div>

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3 shadow-md backdrop-blur-sm">
              <Code className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {title || "Tuyển dụng"}
            </h2>
          </div>

          <div className="flex items-center text-white text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-5 mb-6">
          <div className="flex">
            <div className="flex-shrink-0 w-1/3">
              <div className="flex items-center">
                <div className="w-2 h-6 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 mr-3 shadow-sm"></div>
                <span className="font-medium text-gray-800">Yêu cầu:</span>
              </div>
            </div>
            <div className="flex-grow flex flex-wrap gap-2">
              {requirementsArray && requirementsArray.length > 0 ? (
                requirementsArray.map((req, index) => (
                  <span
                    key={index}
                    className="text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm border border-blue-100 shadow-sm hover:bg-blue-100 transition-colors duration-200"
                  >
                    {req}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Không có yêu cầu cụ thể</span>
              )}
            </div>
          </div>

          <div className="flex">
            <div className="flex-shrink-0 w-1/3">
              <div className="flex items-center">
                <div className="w-2 h-6 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 mr-3 shadow-sm"></div>
                <span className="font-medium text-gray-800">Kinh nghiệm:</span>
              </div>
            </div>
            <div className="flex-grow">
              <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm border border-gray-100 shadow-sm">
                {formattedExperience}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="group flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md"
            onClick={handleApplyClick}
          >
            <span>Ứng tuyển</span>
            <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    requirements: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    postedTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    context: PropTypes.string,
  }).isRequired,
  onApply: PropTypes.func,
};

export default Post;
