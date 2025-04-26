import React, { useState, useEffect } from "react";
import { showErrorToast } from "../../helpers/NotificationToast";
import "react-toastify/dist/ReactToastify.css";
import { getAllPost } from "../../api/postAPI";
import Post from "../../components/Post";

const Home = () => {
  const [listJobsPost, setListJobsPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const response = await getAllPost();

        if (
          response?.status === 200 &&
          response?.data?.isSuccess &&
          response?.data?.data
        ) {
          const posts = response.data.data || [];
          setListJobsPost(posts);
        } else {
          showErrorToast("Error loading post list!");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        showErrorToast("Connection error!");
        setListJobsPost([]);
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {listJobsPost.length > 0 ? (
              listJobsPost.map((post) => (
                <Post
                  key={post.id}
                  job={{
                    id: post.id,
                    title: post.name,
                    requirements: post.technologies,
                    experience: post.experienceYear,
                    postedTime: post.exprised,
                  }}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">Không có bài đăng nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
