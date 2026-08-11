// src/api/client.ts

import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { message } from 'antd';

interface ApiClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const request = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录');
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      message.error('服务器错误，请稍后重试');
    } else {
      message.error(error.message || '请求失败');
    }
    return Promise.reject(error);
  }
);

export default request as ApiClient;
