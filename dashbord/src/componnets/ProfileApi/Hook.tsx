import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../ProfileApi/Axios";

interface JobDetail {
  id: number;
  title: string;
  company: string;
  description: string; // یا نام فیلد Swagger شما
}

export const useJobDetail = (id: number | null) => {
  return useQuery<JobDetail, Error>(
    ["jobDetail", id],
    async () => {
      const { data } = await axiosInstance.get(`/Auth/GetJobDetails?id=${id}`);
      return data;
    },
    {
      enabled: !!id,
    }
  );
};
