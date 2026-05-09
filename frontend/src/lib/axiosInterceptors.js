import axios from "./axios.js";
import { useUserStore } from "../stores/useUserStore.js";

let refreshPromise = null;

export const setupInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/refresh-token")
      ) {
        originalRequest._retry = true;

        const { refreshToken, logout } = useUserStore.getState();

        try {
          if (refreshPromise) {
            await refreshPromise;
            return axios(originalRequest);
          }

          refreshPromise = refreshToken();
          await refreshPromise;
          refreshPromise = null;

          return axios(originalRequest);
        } catch (err) {
          refreshPromise = null;
          logout();
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );
};
