import axios from "axios";
import { useSelector } from "react-redux";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API
})

instance.defaults.withCredentials = true;
var myCookie = document.cookie.split(`${process.env.REACT_APP_COOKIE_NAME}=`)[1];
instance.defaults.headers.common["Authorization"] = `Bearer ${myCookie} `;

instance.interceptors.request.use(function (config) {
    // var user  = useSelector(state=>state.user);
    // if(user.accessToken){
    //     config.headers.Authorization=user.accessToken;
    // }
    // console.log(user.accessToken);
    return config;
}, function (error) {
    // Do something with request error
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