import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import SkillItem from "../../components/SkillItem";
import SearchBar from "../../components/Searchbar";
import Post from "../../components/Post";
import { getAllPost, getAllTechnology } from "../../api/postAPI";
import { showErrorToast } from "../../helpers/NotificationToast";
import useDebounce from "../../hooks/useDebounce";

const FindJob = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);
  const initialSkillsCount = 6;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getAllPost();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setJobs(response.data.data || []);
      } else {
        setError("Error loading job list!");
        showErrorToast("Error loading job list!");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Connection error!");
      showErrorToast("Connection error!");
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await getAllTechnology();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setSkills(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSkills();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (value) => {
    console.log("Search submitted:", value);
    setSearchQuery(value);
  };

  const handleSkillClick = (skill) => {
    if (selectedSkills.includes(skill.id)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill.id]);
    }

    console.log("Selected skills:", selectedSkills);
  };

  const formatJobData = (job) => {
    return {
      id: job.id,
      title: job.name || "Tuyển dụng",
      requirements: Array.isArray(job.technologies) ? job.technologies : [],
      experience:
        typeof job.experienceYear === "number"
          ? `${job.experienceYear} năm`
          : job.experienceYear || "Không yêu cầu",
      postedTime: job.exprised || "",
      context: job.context || "",
    };
  };

  const filteredJobs = jobs
    .filter((job) => {
      if (
        selectedSkills.length === 0 &&
        (!debouncedSearchQuery || debouncedSearchQuery.trim() === "")
      ) {
        return false;
      }

      if (selectedSkills.length > 0) {
        const jobTechnologies = Array.isArray(job.technologies)
          ? job.technologies
          : [];
        const jobTechIds = jobTechnologies.map((tech) =>
          typeof tech === "object" && tech !== null ? tech.id : tech
        );

        const hasMatchingSkill = selectedSkills.some((skillId) =>
          jobTechIds.includes(skillId)
        );

        if (!hasMatchingSkill) return false;
      }

      if (debouncedSearchQuery && debouncedSearchQuery.trim() !== "") {
        const jobName = job.name || "";
        const jobContext = job.context || "";

        return (
          jobName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          jobContext.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }

      return true;
    })
    .map(formatJobData);

  return (
    <div className="min-h-screen bg-white">
      <div className="py-6">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          placeholder="Tìm kiếm công việc..."
        />
      </div>

      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {skills.length > 0 ? (
            <>
              {(showAllSkills
                ? skills
                : skills.slice(0, initialSkillsCount)
              ).map((skill) => (
                <SkillItem
                  key={skill.id}
                  title={skill.name}
                  isSelected={selectedSkills.includes(skill.id)}
                  onClick={() => handleSkillClick(skill)}
                />
              ))}

              {skills.length > initialSkillsCount && (
                <button
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:bg-gray-50 flex items-center"
                >
                  {showAllSkills ? (
                    <>
                      <span>Less</span>
                      <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      <span>More</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            Array(7)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 animate-pulse"
                  style={{ width: `${Math.floor(Math.random() * 60) + 80}px` }}
                >
                  &nbsp;
                </div>
              ))
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : debouncedSearchQuery.trim() !== "" || selectedSkills.length > 0 ? (
          filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <Post key={job.id} job={job} />)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy công việc phù hợp
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Vui lòng nhập từ khóa tìm kiếm hoặc chọn kỹ năng để hiển thị danh
              sách công việc
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJob;
