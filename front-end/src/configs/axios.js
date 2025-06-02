// import axios from "axios";
// import { useSelector } from "react-redux";

// const instance = axios.create({
//     baseURL: process.env.REACT_APP_API
// })

// instance.defaults.withCredentials = true;
// var myCookie = document.cookie.split(`${process.env.REACT_APP_COOKIE_NAME}=`)[1];
// instance.defaults.headers.common["Authorization"] = `Bearer ${myCookie}`;

// instance.interceptors.request.use(function (config) {
//     // var user  = useSelector(state=>state.user);
//     // if(user.accessToken){
//     //     config.headers.Authorization=user.accessToken;
//     // }
//     // console.log(user.accessToken);
//     return config;
// }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
// });


import axios from "axios";
import store from "../redux/store";
import { setDataMain, resetDataMain } from "../redux/userSlice";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API
});

instance.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const getRefreshTokenFromCookie = () => {
    const cookieName = process.env.REACT_APP_COOKIE_NAME;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return value;
        }
    }

    return null;
};

const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshTokenFromCookie();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(`${process.env.REACT_APP_API}/User/refresh`, {
            refreshToken: refreshToken
        });

        if (response?.status === 200 && response?.data?.isSuccess) {
            const data = response.data.data;

            document.cookie = `${process.env.REACT_APP_COOKIE_NAME}=${data.refreshToken}; SameSite=None; Secure`;
            store.dispatch(setDataMain({
                id: data.id,
                email: data.email,
                name: data.name,
                roles: data.roles,
                accessToken: data.accessToken,
            }));

            return data.accessToken;
        } else {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error('Refresh token error:', error);

        document.cookie = `${process.env.REACT_APP_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        store.dispatch(resetDataMain());

        window.location.href = '/login';

        throw error;
    }
};

instance.interceptors.request.use(function (config) {
    const state = store.getState();
    const accessToken = state.user?.accessToken;
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return instance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshAccessToken();
                processQueue(null, newAccessToken);
                
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
                
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;





// import axios from "axios";
// import store from "../redux/store";

// const instance = axios.create({
//     baseURL: process.env.REACT_APP_API
// });

// instance.defaults.withCredentials = true;

// instance.interceptors.request.use(function (config) {
//     const state = store.getState();
//     const accessToken = state.user?.accessToken;
    
//     if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }
    
//     return config;
// }, function (error) {
//     return Promise.reject(error);
// });

// instance.interceptors.response.use((response) => {
//     return response;
// }, async function (error) {
//     return Promise.reject(error);
// });

// // Add a response interceptor
// instance.interceptors.response.use((response) => {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response;
// }, async function (error) {
   

// });
// export default instance;