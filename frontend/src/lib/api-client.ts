/**
 * API Client Wrapper
 * 
 * Wraps customInstance from @npl/frontend for Orval to use.
 * This thin wrapper allows Orval to find the mutator while keeping
 * the actual implementation in the library.
 * 
 * Also injects Bearer token authentication for password-based auth.
 */
import { customInstance as libCustomInstance, axiosInstance as libAxiosInstance } from '@npl/frontend';
import type { AxiosRequestConfig } from 'axios';
import { authService } from '@/auth';

// Add request interceptor to inject Bearer token
libAxiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors and token refresh
libAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        const token = authService.getAccessToken();
        
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return libAxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        authService.logout();
        window.location.reload();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const axiosInstance = libAxiosInstance;

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return libCustomInstance<T>(config, options);
};
