import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, setTokenGetter, setTokenSetter } from '@/lib/axios';
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
  MeResponse,
} from '@animation-co/shared-types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const queryClient = useQueryClient();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  // Fetch current user (if token exists)
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', accessToken],
    queryFn: async () => {
      if (!accessToken) {
        return null;
      }

      const response = await apiClient.get<MeResponse>('/auth/me');
      return response.data.user;
    },
    retry: false, // Don't retry if 401 (invalid token)
    enabled: !!accessToken,
  });

  // On mount, get access token
  useEffect(() => {
    // Auto-refresh on mount to get access token
    const fetchAccessToken = async (): Promise<void> => {
      try {
        const response =
          await apiClient.post<RefreshTokenResponse>('/auth/refresh');
        setAccessToken(response.data.accessToken);
      } catch {
        // Silent fail is intentional - no cookie or expired token
        // means user simply isn't logged in
      } finally {
        setIsRefreshing(false);
      }
    };

    void fetchAccessToken();
  }, []);

  // Tell axios how to get the current access token
  useEffect(() => {
    setTokenGetter(() => accessToken);
    setTokenSetter(setAccessToken);
  }, [accessToken]);

  // Helper to clear all tokens
  const clearTokens = (): void => {
    setAccessToken(null);
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      return response.data;
    },
    onSuccess: data => {
      setAccessToken(data.accessToken);
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
      await apiClient.post('/auth/logout');
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

  // Return value
  const value: AuthContextType = {
    user: user ?? null,
    isLoading: isLoading || isRefreshing,
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
