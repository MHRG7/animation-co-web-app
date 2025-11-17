import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api', // Proxied to http://localhost:3001/api
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies if needed later
});

// Response interceptor (automatically attach token to requests)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor (handle errors globally)
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      // TODO: Trigger token refresh or refirect to login
    }
    return Promise.reject(error as Error);
  }
);
