import axios from "axios";

const rootUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const instance = axios.create({
  baseURL: rootUrl,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
