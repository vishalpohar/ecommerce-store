import { useUserStore } from "../stores/useUserStore";

let refreshPromise = null;

export const setupAuthInterceptors = (axios) => {
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

        if (!refreshPromise) {
          refreshPromise = refreshToken()
            .catch((err) => {
              logout();
              return Promise.reject(err);
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        try {
          await refreshPromise;
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    },
  );
};
