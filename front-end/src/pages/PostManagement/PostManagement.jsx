import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import PostManagementItem from "../../components/PostManagementItem";
import CreatePostModal from "../../components/PostModalManager/CreatePostModal";
import UpdatePostModal from "../../components/PostModalManager/UpdatePostModal";

//import DeletePostModal from "../../components/PostModalManager/DeletePostModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

import DeletePostModal from "../../components/PostModalManager/DeletePostModal";
import useDebounce from "../../hooks/useDebounce";


const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState("");



  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // --------- test useDebounce ----------- //
  const debounce = useDebounce(searchValue);
  useEffect(() => {
    if(debounce.trim().length != 0){
      console.log(debounce);
    }
  }, [debounce]);
// ------------------------------------------//
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

        setPosts(mockPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("An error occurred while loading post data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    setShowCreateModal(true);
  };

  const handleUpdatePost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    setCurrentPost(postToEdit);
    setShowEditModal(true);
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

  const handleSubmitCreateForm = (formData) => {
    const newPost = {};
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    setShowCreateModal(false);
  };

  const handleSubmitUpdateForm = (formData) => {
    if (!currentPost) return;

    const updatedPosts = posts.map((post) =>
      post.id === currentPost.id ? { ...post, ...formData } : post
    );

    setPosts(updatedPosts);

    setShowEditModal(false);
    setCurrentPost(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 flex">
        
          <button
            onClick={handleCreatePost}
            className="px-4 w-1/4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Tạo mới
          </button>
          <div className="w-3/4"> 
          {/* test using useDebounce for search function */}
            <input
            value={searchValue}
            onChange={(e)=>setSearchValue(e.target.value)} 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
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
                post={post}
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
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreateForm}
      />

      <UpdatePostModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCurrentPost(null);
        }}
        post={currentPost}
        onSubmit={handleSubmitUpdateForm}
      />

      {/* <DeletePostModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentPost(null);
        }}
        postId={currentPost?.id}
        postTitle={currentPost?.title}
        onConfirm={handleConfirmDelete}
      /> */}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={currentPost?.id}
        itemName={currentPost?.title}
        itemType="bài đăng"
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default PostManagement;
