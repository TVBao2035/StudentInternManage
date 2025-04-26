import axios from '../configs/axios';

export const getAllPost = async () => {
    return await axios.get("/Post");
}

export const getAllTechnology = async () => {
    return await axios.get("/Technology");
}

export const createPost = async (postData) => {
    return await axios.post("/Post", postData);
}