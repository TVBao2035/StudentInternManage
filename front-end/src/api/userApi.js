import axios from '../configs/axios';

export const register = async ({name, email, phone, password})=> {
    return await axios.post("/User/register", {name, email, phoneNumber:phone, password});
}

export const login = async ({email, password})=> {
    return await axios.post("/User/login", {email, password});
}

export const refresh = async () => {
    return await axios.post("/User/refresh");
}

export const getAllUser = async () => {
    return await axios.get("/User");
}