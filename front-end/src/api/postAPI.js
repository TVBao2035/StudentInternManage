import axios from '../configs/axios';

export const getAllPost = async () => {
    return await axios.get("/Post");
}

export const getDetailPostById = async (postId) => {
    return await axios.get(`/Post/${postId}`);
}

export const getAllTechnology = async () => {
    return await axios.get("/Technology");
}

export const createPost = async (postData) => {
    return await axios.post("/Post", postData);
}

export const updatePost = async (postData) => {
    return await axios.put("/Post", postData);
}

export const deletePost = async (postId) => {
    return await axios.delete(`/Post/${postId}`);
}

export const searchPosts = async (searchRequest) => {
    return await axios.post("/Post/search", searchRequest);
}