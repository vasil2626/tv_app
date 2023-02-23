import axios from "axios";

const url = "https://api.themoviedb.org/3";

const axiosInstance = axios.create();

// axiosInstance.options(url);

axiosInstance.interceptors.response.use(
  (response) => response,
  (err) => {
    Promise.reject(
      (err.response && err.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;
