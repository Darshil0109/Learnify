import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // your base API url
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      // Add any custom headers if needed
    }
});
function getCookie(name:string) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
    }
    return null;
}
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken') ; // or from cookies if you prefer
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;