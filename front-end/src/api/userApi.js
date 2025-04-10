import axios from '../configs/axios';

export const register = async ({name, email, phone, password})=> {
    return await axios.post("/User/register", {name, email, phoneNumber:phone, password});
}

export const login = async ({email, password})=> {
    return await axios.post("/user/login", {email, password});
}

export const getAllUser = async () => {
    return await axios.get("/user");
}