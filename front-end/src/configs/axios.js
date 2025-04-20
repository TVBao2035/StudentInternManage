import axios from "axios";

const instance = axios.create({
    baseURL: ""
})

instance.defaults.withCredentials = true;
instance.interceptors.request.use(function (config) {
   
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