import axios from '../configs/axios';

export const getAllJobApplications = async () => {
    return await axios.get("/Job");
}

export const createJobApplication = async (postId) => {
    return await axios.post("/Job", { postId });
}

export const updateJobApplication = async (jobData) => {
    return await axios.put("/Job", jobData);
}

export const deleteJobApplication = async (jobId) => {
    return await axios.delete(`/Job/${jobId}`);
}
