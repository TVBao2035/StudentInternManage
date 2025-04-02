import axios from '../configs/axios';

export const login = async ({email, password})=> {
    return await axios.post("/user/login", {email, password});
}

export const getAllUser = async () => {
    return await axios.get("/user");
}