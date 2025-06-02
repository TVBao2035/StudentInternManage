import axios from '../configs/axios';

export const getAllJobApplications = async () => {
    return await axios.get("/Job");
};

export const getMyApplications = async () => {
    return await axios.get("/Job/my-applications");
};

export const getJobApplicationById = async (jobId) => {
    return await axios.get(`/Job/${jobId}`);
}

export const createJobApplication = async (postId, applicationData = null) => {
    const payload = {
        postId: postId
    };

    if (applicationData && applicationData.cvUrl) {
        payload.urlCV = applicationData.cvUrl;
    }

    if (applicationData && applicationData.introduction) {
        payload.Message = applicationData.introduction;
    }

    return await axios.post("/Job", payload);
}

export const updateJobApplication = async (jobId, updateData) => {
    try {
        const jobDetail = await getJobApplicationById(jobId);
        const currentJob = jobDetail.data.data;

        const jobData = {
            id: jobId,
            postId: currentJob.postId,
            urlCV: currentJob.urlCV || "",
            status: updateData.status
        };

        return await axios.put("/Job", jobData);
    } catch (error) {
        console.error(`Error updating job application with ID ${jobId}:`, error);
        throw error;
    }
    ;
}

export const deleteJobApplication = async (jobId) => {
    return await axios.delete(`/Job/${jobId}`);
}
