import React, { createContext, useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for token storage
const getAccessToken = (): string | null => localStorage.getItem('accessToken');
const getRefreshToken = (): string | null =>
  localStorage.getItem('refreshToken');

const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const queryClient = useQueryClient();

  // Fetch current user (if token exists)
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) {
        return null;
      }

      const response = await apiClient.get<{ user: User }>('/auth/me');
      return response.data.user;
    },
    retry: false, // Don't retry if 401 (invalid token)
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      return response.data;
    },
    onSuccess: data => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(['user'], data.user); // Update cache
    },
  });

  const login = async (credentials: LoginRequest): Promise<void> => {
    await loginMutation.mutateAsync(credentials);
  };

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post<RegisterResponse>(
        '/auth/register',
        data
      );
      return response.data;
    },
  });

  const register = async (data: RegisterRequest): Promise<void> => {
    await registerMutation.mutateAsync(data);
    // After registration, user needs to login
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    },
    onSettled: () => {
      clearTokens();
      queryClient.setQueryData(['user'], null);
      queryClient.clear(); // Clear all cached queries
    },
  });

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
