import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./Axios";

export const useJobDetail = (id: number | null) => {
  return useQuery({
    queryKey: ["jobDetail", id],
    queryFn: async () => {
      // آدرس دریافت جزئیات با ID
      const { data } = await axiosInstance.get(`/News/Get/${id}`);
      return data;
    },
    enabled: !!id, // فقط وقتی id مقدار دارد درخواست بفرست
  });
};