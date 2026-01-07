import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://uat-prosha.dayatadbir.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;