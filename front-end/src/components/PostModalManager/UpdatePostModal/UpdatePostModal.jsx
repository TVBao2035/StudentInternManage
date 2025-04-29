import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";

const UpdatePostModal = ({ isOpen, onClose, post, onSubmit, technologies = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    requirements: [],
    experience: "",
    //position: "",
    context: "",
  });

  const [requirementTags, setRequirementTags] = useState([]);
  //const [positionTag, setPositionTag] = useState("");

  const [showRequirementsDropdown, setShowRequirementsDropdown] =
    useState(false);
  //const [showPositionsDropdown, setShowPositionsDropdown] = useState(false);

  const requirementsRef = useRef(null);
  //const positionsRef = useRef(null);

  const availableRequirements = technologies.length > 0 ? technologies : [];

  // const availablePositions = [
  //   "Frontend Developer",
  //   "Backend Developer",
  //   "Full Stack Developer",
  //   "Mobile Developer",
  //   "UI/UX Designer",
  //   "DevOps Engineer",
  //   "QA Engineer",
  //   "Product Manager",
  //   "Project Manager",
  // ];

  useEffect(() => {
    if (isOpen && post) {
      //console.log("Post data received in modal:", post);
      //console.log("Technologies available:", technologies);

      const postTitle = post.name || "";
      const postExperience = 
        typeof post.experienceYear === "number"
          ? (post.experienceYear === 0 ? "Không" : `${post.experienceYear} năm`)
          : post.experience || "";
      
      //console.log("Setting title:", postTitle);
      //console.log("Setting experience:", postExperience);
      setFormData({
        title: postTitle,
        experience: postExperience,
        context: post.context || "",
      });

      if (Array.isArray(post.technologies)) {
        //console.log("Technologies is array:", post.technologies);
        setRequirementTags(post.technologies);
      } else if (typeof post.requirements === "string" && post.requirements) {
        //console.log("Requirements is string:", post.requirements);
        const reqNames = post.requirements.split(",").map(item => item.trim());
        
        const techObjects = reqNames.map(name => {
          const tech = technologies.find(t => t.name === name);
          return tech || { id: null, name: name };
        });
        setRequirementTags(techObjects);
      } else {
        console.log("No technologies or requirements found");
        setRequirementTags([]);
      }
    }
  }, [isOpen, post, technologies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        requirementsRef.current &&
        !requirementsRef.current.contains(event.target)
      ) {
        setShowRequirementsDropdown(false);
      }
      // if (
      //   positionsRef.current &&
      //   !positionsRef.current.contains(event.target)
      // ) {
      //   setShowPositionsDropdown(false);
      // }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectRequirement = (requirement) => {
    if (!requirementTags.some(tag => tag.id === requirement.id)) {
      setRequirementTags([...requirementTags, requirement]);
    }
    setShowRequirementsDropdown(false);
  };

  // const handleSelectPosition = (position) => {
  //   setPositionTag(position);
  //   setFormData((prev) => ({ ...prev, position }));
  //   setShowPositionsDropdown(false);
  // };

  const removeRequirementTag = (tagToRemove) => {
    setRequirementTags(requirementTags.filter((tag) => tag.id !== tagToRemove.id));
  };

  // const removePositionTag = () => {
  //   setPositionTag("");
  //   setFormData((prev) => ({ ...prev, position: "" }));
  // };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      requirements: requirementTags,
      //position: positionTag,
    };

    onSubmit(dataToSubmit);
  };

  const filteredRequirements = availableRequirements.filter(
    (req) => !requirementTags.some(tag => tag.id === req.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600">Chỉnh sửa</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề:
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yêu cầu:
              </label>
              <div className="relative" ref={requirementsRef}>
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md flex items-center flex-wrap gap-2 cursor-pointer"
                  onClick={() => setShowRequirementsDropdown(true)}
                >
                  {requirementTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {typeof tag === 'object' ? tag.name : tag}
                      <button
                        type="button"
                        className="ml-2 text-white font-bold"
                        onClick={() => removeRequirementTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {requirementTags.length === 0 && (
                    <span className="text-gray-500">Chọn yêu cầu...</span>
                  )}
                  <ChevronDown className="h-5 w-5 text-gray-400 ml-auto" />
                </div>
                {showRequirementsDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredRequirements.length > 0 ? (
                      filteredRequirements.map((req, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handleSelectRequirement(req)}
                        >
                          {typeof req === 'object' ? req.name : req}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        Không có tùy chọn nào khác
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kinh nghiệm:
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vị trí:
              </label>
              <div className="relative" ref={positionsRef}>
                <div
                  className="w-full px-3 py-2 border border-gray-300 rounded-md flex items-center cursor-pointer"
                  onClick={() => setShowPositionsDropdown(true)}
                >
                  {positionTag ? (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      {positionTag}
                      <button
                        type="button"
                        className="ml-2 text-white font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePositionTag();
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ) : (
                    <span className="text-gray-500">Chọn vị trí...</span>
                  )}
                  <ChevronDown className="h-5 w-5 text-gray-400 ml-auto" />
                </div>
                {showPositionsDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {availablePositions.map((pos, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleSelectPosition(pos)}
                      >
                        {pos}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quyền lợi:
              </label>
              <textarea
                name="context"
                value={formData.context}
                onChange={handleTextareaChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px] resize-y"
              ></textarea>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePostModal;