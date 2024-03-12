import axios from "axios";

// next .env build || dev
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api";
// const baseURL = "http://localhost:3003/api";

const axiosInstance = axios.create({
  baseURL: baseURL,
});

// 每次訪問加上 token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiHelper = axiosInstance;
