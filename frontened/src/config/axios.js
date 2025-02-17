import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

console.log('API URL:', baseURL);

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
});

export default axiosInstance;