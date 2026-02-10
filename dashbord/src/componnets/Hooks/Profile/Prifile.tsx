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

export interface ApiResponse<T> {
  isSuccess: boolean;
  valueOrDefault: T | null;
  value: T | null;
  errors: any[];
}

export interface OptionItem {
  value: string;
  label: string;
}

export const getMyProfile = async (): Promise<UserProfileData> => {
  try {
    const response = await Profile.get<ApiResponse<UserProfileData>>('/User/MyProfile');
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
    const response = await Profile.put<ApiResponse<UserProfileData>>('/User/MyProfile', payload);
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
  try {
    const response = await Profile.get<ApiResponse<any>>('/admin/Provinces/Search?Page=1&Size=300');
    if (response.data.isSuccess && response.data.value) {
      const pagedResult = response.data.value;
      if (pagedResult && Array.isArray(pagedResult.data)) {
        return pagedResult.data.map((item: any) => ({
          value: item.id,
          label: item.name
        }));
      }
    }
    return [];
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
};

export const getCities = async (provinceId: string): Promise<OptionItem[]> => {
  try {
    const response = await Profile.get<ApiResponse<any>>(`/admin/Cities/Search?ProvinceId=${provinceId}&Page=1&Size=300`);
    if (response.data.isSuccess && response.data.value) {
      const pagedResult = response.data.value;
      if (pagedResult && Array.isArray(pagedResult.data)) {
        return pagedResult.data.map((item: any) => ({
          value: item.id,
          label: item.name
        }));
      }
    }
    return [];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};