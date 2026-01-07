import axios from "axios";

const axiosInstance = axios.create({
  // اصلاح شده: baseURL نباید شامل مسیر کامل باشد
  baseURL: "http://uat-prosha.dayatadbir.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;