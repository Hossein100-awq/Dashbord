import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const setupInterceptors = (instance: any) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        let businessKey = localStorage.getItem('businessKey');

        if (!businessKey) {
          businessKey = '1da5ce01-7491-44a2-a823-2f4734ef0aef';
          localStorage.setItem('businessKey', businessKey);
        }

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (businessKey && config.headers) {
          config.headers['BusinessKey'] = businessKey;
        }
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: any) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          if (window.location.pathname !== '/') {
             localStorage.removeItem('accessToken');
             window.location.href = '/'; 
          }
        }
      }
      return Promise.reject(error);
    }
  );
};

export const authClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://uat-prosha.wingom.ir/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});
setupInterceptors(authClient);

export const merchantApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_MERCHANT || 'https://uat-prosha.wingom.ir/merchant',
  headers: {
    'Content-Type': 'application/json',
  },
});
setupInterceptors(merchantApiClient);

export const Profile = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_PROFILE || '/proxy',
  headers:{
    'Content-Type':'application/json',
    'Accept': 'application/json'
  }
})
setupInterceptors(Profile)

export const CostType = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_CREDIT || 'https://uat-prosha.wingom.ir/creditapi',
  headers:{
    'Content-Type':'application/json'
  }
})
setupInterceptors(CostType)

export default authClient;