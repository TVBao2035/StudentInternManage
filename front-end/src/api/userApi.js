import axios from '../configs/axios';
import instance from '../configs/axios';

export const register = async ({name, email, phone, password})=> {
    return await axios.post("/User/register", {name, email, phoneNumber:phone, password});
}

export const login = async ({email, password})=> {
    return await axios.post("/User/login", {email, password});
}

// export const refresh = async () => {
//     return await axios.post("/User/refresh");
// }

export const getAllUser = async () => {
    return await axios.get("/User");
}

export const getDetailUserById = async (userid) => {
    return await axios.get(`/User/${userid}`);
}

export const createUser  = async (user) => {
    return await axios.post("/User", user);
}

export const updateUser = async (user)=> {
    return await axios.put("/User", user);
}
export const updateUserByAdmin = async (user) => {
    return await axios.put("/User/Admin/Edit", user);
}
export const deleteUser = async (userid) => {
    return await axios.delete(`/User/${userid}`);
}

export const refresh = async () => {
    try {
        const cookieName = process.env.REACT_APP_COOKIE_NAME;
        const refreshToken = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${cookieName}=`))
            ?.split('=')[1];

        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await instance.post('/User/refresh', {
            refreshToken: refreshToken
        });

        return response;
    } catch (error) {
        console.error('Refresh API error:', error);
        throw error;
    }
};

export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        return true;
    }
};

export const getTokenExpirationTime = (token) => {
    if (!token) return 0;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return Math.max(0, payload.exp - currentTime);
    } catch (error) {
        return 0;
    }
};