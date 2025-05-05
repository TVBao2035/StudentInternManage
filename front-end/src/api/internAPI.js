import axios from '../configs/axios';

export const getAllEmployee = async () => {
    return await axios.get("/employee");
}

export const createEmployeeIntern = async (internData) => {
    return await axios.post("/employee", internData);
}

export const updateEmployee = async (employeeData) => {
    return await axios.put("/employee", employeeData);
}

export const deleteEmployee = async (employeeId) => {
    return await axios.delete(`/employee/${employeeId}`);
}


