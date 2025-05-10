import { useState } from "react";
import {
  getAllPost,
  getDetailPostById,
  getAllTechnology,
  createPost,
  updatePost,
  deletePost,
} from "../api/postAPI";
import { showSuccessToast, showErrorToast } from "../helpers/NotificationToast";

export const usePostAPI = () => {
  const [posts, setPosts] = useState([]);
  const [postDetail, setPostDetail] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllPost();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setPosts(response.data.data || []);
        return response.data.data;
      } else {
        const errorMsg = "Error loading post list!";
        setError(errorMsg);
        showErrorToast(errorMsg);
        return null;
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Connection error!");
      showErrorToast("Connection error!");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetail = async (postId) => {
    if (!postId) return null;

    setLoading(true);
    setError(null);
    try {
      const response = await getDetailPostById(postId);
      if (
        response?.status === 200 &&
        response?.data.isSuccess &&
        response?.data?.data
      ) {
        setPostDetail(response.data.data);
        return response.data.data;
      } else {
        const errorMsg =
          response?.data?.message || "Error loading post details!";
        setError(errorMsg);
        showErrorToast(errorMsg);
        return null;
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
      setError("Connection error!");
      showErrorToast("Connection error !");
      return null;
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
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching technologies:", error);
      return [];
    }
  };

  const createNewPost = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await createPost(formData);
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        showSuccessToast("Post created successfully!");
        await fetchPosts();
        return true;
      } else {
        showErrorToast(response?.data?.message || "Error creating post!");
        return false;
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showErrorToast("Connection error while creating post!");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExistingPost = async (formData, currentPost) => {
    if (!currentPost) return false;

    setIsSubmitting(true);
    try {
      const response = await updatePost(formData);
      if (response?.status === 200 && response?.data?.isSuccess) {
        showSuccessToast("Post updated successfully!");
        await fetchPosts();
        return true;
      } else {
        showErrorToast(response?.data?.message || "Error updating post!");
        return false;
      }
    } catch (error) {
      console.error("Error updating post:", error);
      showErrorToast("Connection error while updating post!");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExistingPost = async (postId) => {
    try {
      const response = await deletePost(postId);
      if (response?.status === 200 && response?.data?.isSuccess) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        showSuccessToast("Post deleted successfully!");
        return true;
      } else {
        showErrorToast(response?.data?.message || "Error deleting post!");
        await fetchPosts();
        return false;
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showErrorToast("Connection error while deleting post!");
      await fetchPosts();
      return false;
    }
  };

  return {
    posts,
    postDetail,
    technologies,
    loading,
    error,
    isSubmitting,
    fetchPosts,
    fetchPostDetail,
    fetchTechnologies,
    createNewPost,
    updateExistingPost,
    deleteExistingPost,
  };
};
