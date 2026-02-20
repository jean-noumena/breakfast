/**
 * API Client Wrapper
 * 
 * Wraps customInstance from @npl/frontend for Orval to use.
 * This thin wrapper allows Orval to find the mutator while keeping
 * the actual implementation in the library.
 * 
 * Also injects Bearer token authentication for OIDC.
 */
import { customInstance as libCustomInstance, axiosInstance as libAxiosInstance } from '@npl/frontend';
import type { AxiosRequestConfig } from 'axios';

// Helper to get OIDC user from session storage
const getOidcUser = () => {
  try {
    // react-oidc-context stores user data with this key pattern
    const oidcKey = Object.keys(sessionStorage).find(key => 
      key.startsWith('oidc.user:') || key.includes('oidc.user')
    );
    
    if (oidcKey) {
      const userData = sessionStorage.getItem(oidcKey);
      if (userData) {
        return JSON.parse(userData);
      }
    }
  } catch (error) {
    console.error('Error getting OIDC user:', error);
  }
  return null;
};

// Add request interceptor to inject Bearer token from OIDC
libAxiosInstance.interceptors.request.use(
  (config) => {
    const user = getOidcUser();
    if (user?.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
libAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      window.location.href = '/';
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
