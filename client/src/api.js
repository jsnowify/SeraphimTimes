import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

export default API;
