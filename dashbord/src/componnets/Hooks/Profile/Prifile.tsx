import { Profile } from './../../../Interceptor/axios';

export interface UserProfileData {
  id: string;
  fullName: string;
  phoneNo: string;
  iban: string;
  province: string;
  provinceName: string;
  city: string;
  cityName: string;
  address: string;
  email: string;
  birthDate: string;
  brandTitle?: string;
}

export interface ApiResponse {
  isSuccess: boolean;
  valueOrDefault: UserProfileData;
  value: UserProfileData;
  errors: any[];
}

export interface OptionItem {
  value: string;
  label: string;
}

export const getMyProfile = async (): Promise<UserProfileData> => {
  try {
    const response = await Profile.get<ApiResponse>('/User/MyProfile');
    
    if (response.data.isSuccess && response.data.value) {
      return response.data.value;
    } else {
      throw new Error('خطا در دریافت اطلاعات پروفایل');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateMyProfile = async (payload: any): Promise<UserProfileData> => {
  try {
    const response = await Profile.put<ApiResponse>('/User/MyProfile', payload);
    
    if (response.data.isSuccess && response.data.value) {
      return response.data.value;
    } else {
      throw new Error('خطا در بروزرسانی پروفایل');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};


export const getProvinces = async (): Promise<OptionItem[]> => {
  const response = await Profile.get('/Province'); 
  

  const data = (response.data as any) || []; 
  
  return data.map((item: any) => ({
    value: item.id || item.value || item.provinceId || "",
    label: item.name || item.provinceName || item.title || ""
  }));
};

export const getCities = async (provinceId: string): Promise<OptionItem[]> => {

  const response = await Profile.get(`/City?provinceId=${provinceId}`); 
  
  const data = (response.data as any) || [];

  return data.map((item: any) => ({
    value: item.id || item.value || item.cityId || "",
    label: item.name || item.cityName || item.title || ""
  }));
};