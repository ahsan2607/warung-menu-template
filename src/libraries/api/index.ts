// ./src/lib/api/index.ts (Updated type to MenuSection[])
import axios, { AxiosError } from 'axios';
import { ApiResponse, MenuSection } from '@/types';
import { OrderItem } from '@/context/OrderContext';

const API_URL = '/api/proxy'; // Matches the new route

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // No cookies needed
});

export const getMenuData = async (): Promise<ApiResponse<MenuSection[]>> => {
  try {
    const response = await api.get<ApiResponse<MenuSection[]>>('');
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const submitOrders = async (orders: OrderItem[], table?: string): Promise<ApiResponse<{ message: string; batchId: string }>> => {
  try {
    const response = await api.post<ApiResponse<{ message: string; batchId: string }>>('', {
      action: 'submitOrders',
      orders,
      table,
    });
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

const handleError = <T>(error: unknown): ApiResponse<T> => {
  if (error instanceof AxiosError && error.response) {
    return { success: false, error: error.response.data.error || 'Server error' };
  }
  return { success: false, error: 'Network error' };
};