import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const PostForm = ({
  initialData = { title: "", experience: "", context: "", requirements: [] },
  technologies = [],
  onSubmit,
  submitButtonText = "Lưu",
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    experience: initialData.experience || "",
    context: initialData.context || "",
  });

  const requirementsRef = useRef(null);
  const [requirementTags, setRequirementTags] = useState(
    initialData.requirements || []
  );
  const [showRequirementsDropdown, setShowRequirementsDropdown] =
    useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        experience: initialData.experience || "",
        context: initialData.context || "",
      });
      setRequirementTags(initialData.requirements || []);
    }
  }, [initialData?.title, initialData?.experience, initialData?.context, JSON.stringify(initialData?.requirements)]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        requirementsRef.current &&
        !requirementsRef.current.contains(event.target)
      ) {
        setShowRequirementsDropdown(false);
      }
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

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSelectRequirement = (requirement) => {
    if (!requirementTags.some((tag) => tag.id === requirement.id)) {
      setRequirementTags([...requirementTags, requirement]);
    }
    setShowRequirementsDropdown(false);
  };

  const removeRequirementTag = (tagToRemove) => {
    setRequirementTags(
      requirementTags.filter((tag) => tag.id !== tagToRemove.id)
    );
  };

  const filteredRequirements = technologies.filter(
    (req) => !requirementTags.some((tag) => tag.id === req.id)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      requirements: requirementTags,
    });
  };

  return (
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
                  {typeof tag === "object" ? tag.name : tag}
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
                      {typeof req === "object" ? req.name : req}
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
            placeholder="Ví dụ: 1 năm, 2 năm, Không yêu cầu..."
          />
        </div>

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
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
