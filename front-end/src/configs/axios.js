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
<<<<<<< HEAD

const instance = axios.create({
    baseURL: ""
})

instance.defaults.withCredentials = true;
instance.interceptors.request.use(function (config) {
   
=======
import store from "../redux/store";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(function (config) {
    const state = store.getState();
    const accessToken = state.user?.accessToken;
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    return response;
}, async function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, async function (error) {
   

});
export default instance;