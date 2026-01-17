import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { RefreshTokenResponse } from '@animation-co/shared-types';

// Store a getter function that returns the current access token
let tokenGetter: (() => string | null) | null = null;
let tokenSetter: ((token: string | null) => void) | null;

export const setTokenGetter = (getter: () => string | null): void => {
  tokenGetter = getter;
};

export const setTokenSetter = (
  setter: (token: string | null) => void
): void => {
  tokenSetter = setter;
};

export const apiClient = axios.create({
  baseURL: '/api', // Proxied to http://localhost:3001/api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies
});

// Response interceptor (automatically attach token to requests)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenGetter?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

async function refreshAccessToken(): Promise<string> {
  const response = await axios.post<RefreshTokenResponse>(
    '/api/auth/refresh',
    {},
    { withCredentials: true }
  );

  return response.data.accessToken;
}

// Response interceptor (handle errors globally)
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry: boolean;
    };

    // Don't try to refresh if the refresh endpoint itself failed
    const isAuthRequest = originalRequest.url?.includes('/auth/');

    // Handle 401 Unauthorized (token expired)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        // Get new access token
        const newAccessToken = await refreshAccessToken();

        // Update React state via the setter
        tokenSetter?.(newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return await apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError as Error);
      }
    }

    return Promise.reject(error as Error);
  }
);
