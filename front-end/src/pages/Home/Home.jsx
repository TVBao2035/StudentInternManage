import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Post from "../../components/Post";
import { toast } from "react-toastify";

const fetchJobs = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: [
          {
            id: 1,
            title: "Tuyển dụng React JS",
            requirements: "React js, Redux, Fluent English",
            experience: "Không",
            position: "Frontend Developer",
            postedTime: "3 ngày trước",
            benefits:
              "Môi trường trẻ, môi trường làm việc hiện đại, năng động, thân thiện và cởi mở.",
          },
          {
            id: 2,
            title: "Tuyển dụng Vue JS",
            requirements: "Vue js, Javascript, Fluent English",
            experience: "Không",
            position: "Frontend Developer",
            postedTime: "7 ngày trước",
            benefits: "Môi trường làm việc năng động, cơ hội thăng tiến cao",
          },
          {
            id: 3,
            title: "Tuyển dụng PHP",
            requirements: "PHP, Fluent English",
            experience: "Không",
            position: "Backend Developer",
            postedTime: "5 ngày trước",
            benefits: "Lương thưởng cạnh tranh, chế độ nghỉ phép hấp dẫn",
          },
          {
            id: 4,
            title: "Tuyển dụng ASP.NET",
            requirements: "Asp.net, C#, Fluent English",
            experience: "Không",
            position: "Full Stack Developer",
            postedTime: "2 ngày trước",
            benefits: "Chế độ bảo hiểm tốt, thưởng dự án theo quý",
          },
        ],
      });
    }, 1000);
  });
};

const Home = () => {
  const [listJobsPost, setListJobsPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchJobs();

        if (response.status === 200) {
          setListJobsPost(response.data);
          toast.error("Có lỗi xảy ra khi tải danh sách công việc");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Có lỗi xảy ra khi kết nối đến máy chủ");
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {listJobsPost.map((job) => (
              <Post
                key={job.id}
                job={job}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;