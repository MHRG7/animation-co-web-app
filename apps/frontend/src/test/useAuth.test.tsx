import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { UserRole } from '@animation-co/shared-types';

// Mock axios module
vi.mock('@lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
  setTokenGetter: vi.fn(),
  setTokenSetter: vi.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws error when used outside AuthProvider', () => {
    // Create a component that tries to use useAuth
    function TestComponent(): React.JSX.Element {
      useAuth(); // This will throw because no provider
      return <div>Test</div>;
    }

    // Expect render to throw the specific error
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within AuthProvider');
  });

  it('remains unauthenticated when refresh token is invalid or missing', async () => {
    const { apiClient } = await import('@/lib/axios');

    // TestComponent to display auth state
    function TestComponent(): React.JSX.Element {
      const auth = useAuth();
      return (
        <div>
          <div data-testid="is-loading">{String(auth.isLoading)}</div>
          <div data-testid="is-authenticated">
            {String(auth.isAuthenticated)}
          </div>
          <div data-testid="user-email">{auth.user?.email ?? 'null'}</div>
        </div>
      );
    }

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    // With httpOnly cookies, frontend always attempts refresh
    // Backend returns 401 if no valid cookie exists
    // Mock /auth/refresh to reject (simulating no cookie)
    vi.mocked(apiClient.post).mockRejectedValueOnce({
      response: { status: 401 },
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    // Verify /auth/refresh was called
    expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh');

    // Verify user is not authenticated
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-email')).toHaveTextContent('null');
  });

  it('auto-refreshes on mount when refresh token exists', async () => {
    const { apiClient } = await import('@/lib/axios');

    // Mock /auth/refresh to return access token
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: {
        accessToken: 'new-access-token',
      },
    });

    // Mock /auth/me to return user data
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          role: UserRole.USER,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      },
    });

    // TestComponent to display auth state
    function TestComponent(): React.JSX.Element {
      const auth = useAuth();
      return (
        <div>
          <div data-testid="is-loading">{String(auth.isLoading)}</div>
          <div data-testid="is-authenticated">
            {String(auth.isAuthenticated)}
          </div>
          <div data-testid="user-email">{auth.user?.email ?? 'null'}</div>
        </div>
      );
    }

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    // Initially should be loading (async operation in progress)
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    // Verify /auth/refresh was called with correct payload
    expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh');

    // Verify /auth/me was called
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');

    // Verify user is authenticated
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@example.com'
    );
  });

  it('login mutation stores tokens and authenticates user', async () => {
    const { apiClient } = await import('@/lib/axios');

    // First call: auto-refresh on mount (will fail - no cookie)
    vi.mocked(apiClient.post).mockRejectedValueOnce({
      response: { status: 401 },
    });

    // Second call: the actual /auth/login endpoint
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: {
        accessToken: 'access-token-123',
        user: {
          id: 1,
          email: 'test@example.com',
          role: UserRole.USER,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      },
    });

    // Mock /auth/me response (called after access token is set)
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          role: UserRole.USER,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      },
    });

    // TestComponent with login button
    function TestComponent(): React.JSX.Element {
      const auth = useAuth();

      const handleLogin = (): void => {
        void auth.login({ email: 'test@example.com', password: 'Password123' });
      };

      return (
        <div>
          <div data-testid="is-loading">{String(auth.isLoading)}</div>
          <div data-testid="is-authenticated">
            {String(auth.isAuthenticated)}
          </div>
          <div data-testid="user-email">{auth.user?.email ?? 'null'}</div>
          <button onClick={handleLogin}>Login</button>
        </div>
      );
    }

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    // Initially: not authenticated
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-email')).toHaveTextContent('null');

    // Simulate login button click
    const user = userEvent.setup();
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);

    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });

    // Verify /auth/login was called
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'Password123',
    });

    // Verify /auth/me was called
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');

    // Verify user email is displayed
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@example.com'
    );
  });

  it('register mutation does NOT store tokens (user must login after)', async () => {
    const { apiClient } = await import('@/lib/axios');

    // First call: auto-refresh on mount (will fail - no cookie)
    vi.mocked(apiClient.post).mockRejectedValueOnce({
      response: { status: 401 },
    });

    // Second call: the actual /auth/register endpoint
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: {
        user: {
          id: 1,
          email: 'newuser@example.com',
          role: UserRole.USER,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      },
    });

    // TestComponent with register button
    function TestComponent(): React.JSX.Element {
      const auth = useAuth();

      const handleRegister = (): void => {
        void auth.register({
          email: 'newuser@example.com',
          password: 'SecurePass123!',
        });
      };

      return (
        <div>
          <div data-testid="is-loading">{String(auth.isLoading)}</div>
          <div data-testid="is-authenticated">
            {String(auth.isAuthenticated)}
          </div>
          <div data-testid="user-email">{auth.user?.email ?? 'null'}</div>
          <button onClick={handleRegister}>Register</button>
        </div>
      );
    }

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    // Initially: not authenticated
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');

    // Simulate register button click
    const user = userEvent.setup();
    const registerButton = screen.getByRole('button', { name: /register/i });
    await user.click(registerButton);

    // Wait for registration to complete
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
      });
    });

    // Verify user is still NOT authenticated
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-email')).toHaveTextContent('null');
  });

  it('logout mutation clears token and revokes refresh token on server', async () => {
    const { apiClient } = await import('@/lib/axios');

    // Mock auto-refresh on mount (to establish logged-in state)
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: {
        accessToken: 'access-token-from-refresh',
      },
    });

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          role: UserRole.USER,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      },
    });

    // TestComponent with logout button
    function TestComponent(): React.JSX.Element {
      const auth = useAuth();

      const handleLogout = (): void => {
        void auth.logout();
      };

      return (
        <div>
          <div data-testid="is-loading">{String(auth.isLoading)}</div>
          <div data-testid="is-authenticated">
            {String(auth.isAuthenticated)}
          </div>
          <div data-testid="user-email">{auth.user?.email ?? 'null'}</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    }

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </QueryClientProvider>
    );

    // Wait for auto-refresh to complete (user becomes authenticated)
    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });

    // Verify user is logged in before logout
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'test@example.com'
    );

    // Mock /auth/logout endpoint
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: {}, // Logout returns 204 No Content, but axios wraps it
    });

    // Simulate logout button click
    const user = userEvent.setup();
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    // Wait for logout to complete
    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    });

    // Verify /auth/logout was called with refresh token
    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');

    // Verify user is logged out
    expect(screen.getByTestId('user-email')).toHaveTextContent('null');
  });
});
