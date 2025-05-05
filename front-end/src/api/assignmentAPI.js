import axios from '../configs/axios';

export const getAllAssignment = async () => {
    return await axios.get("/Assignment");
}

export const createAssignment = async (data) => {
    return await axios.post("/Assignment", data);
}

export const updateAssignment = async (data) => {
    return await axios.put("/Assignment", data);
}

export const deleteAssignment = async (assignmentId) => {
    return await axios.delete(`/Assignment/${assignmentId}`);
}

export const updateScore = async (dataUpdateScore) => {
    return await axios.put("/Assignment/score", dataUpdateScore);
}