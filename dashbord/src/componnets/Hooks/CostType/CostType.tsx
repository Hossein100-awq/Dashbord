import { CostType } from "@/Interceptor/axios";

export interface CostTypeDto {
  id: number;
  name: string;
  description: string;
  isPercentage: boolean;
  isOptional: boolean;
  defaultAmount: number;
}

export interface ApiResponse {
  isSuccess: boolean;
  isFailed: boolean;
  errors?: Array<{ message: string }>;
  value?: any;
}

export const getCostTypes = async (params: { Page: number; Size: number }) => {
  const response = await CostType.get<ApiResponse<{ total: number; data: CostTypeDto[] }>>(
    '/admin/CostTypes/Search',
    { params }
  );
  return response.data;
};

export const addCostType = async (data: Partial<CostTypeDto>) => {
  const response = await CostType.post<ApiResponse<{ id: number }>>(
    '/admin/CostTypes/Add',
    data
  );
  return response.data;
};

export const updateCostType = async (data: CostTypeDto) => {
  const response = await CostType.put<ApiResponse<boolean>>(
    '/admin/CostTypes/Edit',
    data
  );
  return response.data;
};

export const deleteCostType = async (id: number) => {
  const response = await CostType.delete<ApiResponse<boolean>>(
    '/admin/CostTypes/Remove',
    { params: { Id: id } }
  );
  return response.data;
};