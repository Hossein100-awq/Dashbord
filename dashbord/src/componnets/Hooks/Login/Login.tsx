'use client';

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import APICALL from "../../../Interceptor/axios";
import LoginForm from "./../../../app/page";

export interface LoginInputs {
  username: string;
  password: string;
  email?: string;
}

export interface ApiResponse {
  isSuccess: boolean;
  isFailed: boolean;
  value: any;
  errors?: Array<{ message: string }>;
}

export const Login = async (data: LoginInputs): Promise<ApiResponse> => {

  console.log("API: Sending Request with data:", data);
  const response = await APICALL.post<ApiResponse>('/Auth/LoginWithPassword', data);
  return response.data;
};

const LoginPage = () => {
  const router = useRouter();
  const [data, setData] = useState<LoginInputs>({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  console.log("LOGIC: LoginPage Rendered, Current Data:", data);

  const mutation = useMutation({
    mutationFn: Login,
    onSuccess: (response) => {

      console.log("LOGIC: API Success Response:", response);
      
      if (response.isSuccess && response.value) {
        const { accesstoken } = response.value.tokens;
        const { businessKey } = response.value.user;

        if (accesstoken) {
          localStorage.setItem("accessToken", accesstoken);
        }
        if (businessKey) {
          localStorage.setItem("businessKey", businessKey);
        }
        
        console.log("LOGIC: Redirecting to Dashbord...");
        router.push('/Dashbord');
      } else {
        const message = response.errors && response.errors.length > 0 
          ? response.errors[0].message 
          : 'خطایی رخ داد';
        console.log("LOGIC: Setting Error Message:", message);
        setError(message);
      }
    },
    onError: (err: any) => {
      console.log("LOGIC: API Error:", err);
      
      let message = 'خطا در ارتباط با سرور';
      
      if (err?.response?.data) {
        const resData = err.response.data;
        if (resData.errors && Array.isArray(resData.errors) && resData.errors.length > 0) {
          message = resData.errors[0].message;
        } else if (typeof resData === "string") {
          message = resData;
        }
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
   
    console.log("LOGIC: handleLogin Function Called with:", data);
    e.preventDefault();
    setError(null);
    mutation.mutate(data);
  };

  return (
    <LoginForm
      username={data.username}
      password={data.password}
      isLoading={mutation.isLoading}
      error={error}
      onUsernameChange={(val) => {

          console.log("LOGIC: onUsernameChange called with:", val);
          setData({ ...data, username: val });
      }}
      onPasswordChange={(val) => {
          console.log("LOGIC: onPasswordChange called with:", val);
          setData({ ...data, password: val });
      }}
      onSubmit={handleLogin}
    />
  );
};

export default LoginPage;