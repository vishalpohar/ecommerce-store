import axios from "axios";
import { setupAuthInterceptors } from "./authInterceptors";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send cookies to the server
});

setupAuthInterceptors(axiosInstance);

export default axiosInstance;
