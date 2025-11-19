import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

interface RefreshTokenResponse {
  accessToken: string;
}

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

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<RefreshTokenResponse>('/api/auth/refresh', {
    refreshToken: refreshToken,
  });

  return response.data.accessToken;
}

// Response interceptor (handle errors globally)
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry: boolean;
    };

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get new access token
        const newAccessToken = await refreshAccessToken();

        // Update stored token
        localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return await apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError as Error);
      }
    }

    return Promise.reject(error as Error);
  }
);
