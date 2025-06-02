import axios from '../configs/axios';

export const getAllTask = async () => {
    return await axios.get("/Task");
}

export const getTaskByAssignment = async (assignmentId) => {
    return await axios.get(`/Task/assignment/${assignmentId}`);
}

export const getTaskByIntern = async () => {
    return await axios.get("/Task/intern");
}

export const createTask = async (taskData) => {
    return await axios.post("/Task", taskData);
}

export const updateTask = async (taskDataUpdate) => {
    return await axios.put("/Task", taskDataUpdate);
}

export const updateStatusTask = async (statusDataUpdate) => {
    return await axios.put("/Task/Status", statusDataUpdate);
}

export const deleteTask = async (taskId) => {
    return await axios.delete(`/Task/${taskId}`);
}