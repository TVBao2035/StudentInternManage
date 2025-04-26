import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import PostManagementItem from "../../components/PostManagementItem";
import CreatePostModal from "../../components/PostModalManager/CreatePostModal";
import UpdatePostModal from "../../components/PostModalManager/UpdatePostModal";
<<<<<<< HEAD
import DeletePostModal from "../../components/PostModalManager/DeletePostModal";
=======

//import DeletePostModal from "../../components/PostModalManager/DeletePostModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
//import useDebounce from "../../hooks/useDebounce";
import { getAllPost, getAllTechnology, createPost } from "../../api/postAPI";
import {
  showSuccessToast,
  showErrorToast,
} from "../../helpers/NotificationToast";
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const navigate = useNavigate();
=======
  //const navigate = useNavigate();
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
<<<<<<< HEAD

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const mockPosts = [
          {
            id: 1,
            title: "Tuyển dụng React JS",
            postDate: "2025-03-05T00:00:00.000Z",
            requirements: "React js, Redux, Fluent English",
            experience: "Không",
            position: "Frontend Developer",
            benefits:
              "Môi trường trẻ, môi trường làm việc hiện đại, năng động, thân thiện và cởi mở.",
          },
          {
            id: 2,
            title: "Tuyển dụng Vue JS",
            postDate: "2025-01-07T00:00:00.000Z",
            requirements: "Vue js, Javascript, Fluent English",
            experience: "Không",
            position: "Frontend Developer",
            benefits: "Môi trường làm việc năng động, cơ hội thăng tiến cao",
          },
          {
            id: 3,
            title: "Tuyển dụng PHP",
            postDate: "2025-03-05T00:00:00.000Z",
            requirements: "PHP, Fluent English",
            experience: "Không",
            position: "Backend Developer",
            benefits: "Lương thưởng cạnh tranh, chế độ nghỉ phép hấp dẫn",
          },
          {
            id: 4,
            title: "Tuyển dụng ASP.NET",
            postDate: "2025-03-05T00:00:00.000Z",
            requirements: "Asp.net, C#, Fluent English",
            experience: "Không",
            position: "Full Stack Developer",
            benefits: "Chế độ bảo hiểm tốt, thưởng dự án theo quý",
          },
        ];
=======
  const [isSubmitting, setIsSubmitting] = useState(false);
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getAllPost();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setPosts(response.data.data || []);
      } else {
        setError("Error loading post list!");
        showErrorToast("Error loading post list!");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Connection error!");
      showErrorToast("Connection error!");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const response = await getAllTechnology();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setTechnologies(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching technologies:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTechnologies();
  }, []);

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCreateForm = async (formData) => {
    try {
      setIsSubmitting(true);

      const postData = {
        name: formData.title,
        context: formData.context || "",
        experienceYear: formData.experience.includes("năm")
          ? parseInt(formData.experience.replace("năm", "").trim())
          : formData.experience,
        exprised: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        technologies: formData.requirements.map((tech) => ({
          id: tech.id,
          name: tech.name,
        })),
      };

      console.log("Sending data:", postData);

      const response = await createPost(postData);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        showSuccessToast("Post created successfully!");
        fetchPosts();
      } else {
        showErrorToast(response?.data?.message || "Error creating post!");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showErrorToast("Connection error while creating post!");
    } finally {
      setIsSubmitting(false);
      setShowCreateModal(false);
    }
  };

  const handleUpdatePost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    setCurrentPost(postToEdit);
    setShowUpdateModal(true);
  };

  const handleDeletePost = (postId) => {
    const postToDelete = posts.find((post) => post.id === postId);
    setCurrentPost(postToDelete);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
    console.log("Đã xóa bài đăng:", postId);
  };

  const handleSubmitUpdateForm = (formData) => {
    if (!currentPost) return;

    const updatedPosts = posts.map((post) =>
      post.id === currentPost.id ? { ...post, ...formData } : post
    );

    setPosts(updatedPosts);

    setShowUpdateModal(false);
    setCurrentPost(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
<<<<<<< HEAD
        <div className="mb-6">
          <button
            onClick={handleCreatePost}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
=======
        <div className="mb-6 flex">
          <button
            onClick={handleCreatePost}
            className={`px-4 w-1/4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd
          >
            {isSubmitting ? "Đang xử lý..." : "Tạo mới"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostManagementItem
                key={post.id}
                post={{
                  id: post.id,
                  title: post.name,
                  requirements: Array.isArray(post.technologies)
                    ? post.technologies
                        .map((tech) =>
                          typeof tech === "object" ? tech.name : tech
                        )
                        .join(", ")
                    : typeof post.technologies === "string"
                    ? post.technologies
                    : "",
                  experience:
                    typeof post.experienceYear === "number"
                      ? `${post.experienceYear} năm`
                      : post.experienceYear || "Không yêu cầu",
                  postedTime: post.exprised,
                }}
                onEdit={handleUpdatePost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              Bạn chưa có bài đăng tuyển dụng nào
            </p>
            <p className="text-gray-400 mt-2">
              Hãy bắt đầu đăng tin tuyển dụng để tìm kiếm ứng viên phù hợp
            </p>
            <button
              onClick={handleCreatePost}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Tạo bài đăng
            </button>
          </div>
        )}
      </div>

      <CreatePostModal
        technologies={technologies}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreateForm}
        isSubmitting={isSubmitting}
      />

      <UpdatePostModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setCurrentPost(null);
        }}
        post={currentPost}
        onSubmit={handleSubmitUpdateForm}
      />

      <DeletePostModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentPost(null);
        }}
        postId={currentPost?.id}
        postTitle={currentPost?.title}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PostManagement;
