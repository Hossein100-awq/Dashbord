import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./Axios";

export const useJobList = () => {
  return useQuery({
    queryKey: ["jobList"],
    queryFn: async () => {
      // تغییر: درخواست را به فایل محلی api می‌فرستیم (CORS حل می‌شود)
      const { data } = await axiosInstance.get(`/api/news`);
      
      // توجه: چون در فایل route.ts ما مستقیماً data را برگرداندیم، اینجا نیازی به .value نیست مگر اینکه ساختار خروجی اصلی پیچیده باشد.
      // اگر هنوز آرایه مستقیم نگرفتید، می‌توانید دوباره از این خط استفاده کنید:
      // return data.value || data.valueOrDefault || [];
      
      return data; 
    },
    staleTime: 1000 * 60 * 5,
  });
};