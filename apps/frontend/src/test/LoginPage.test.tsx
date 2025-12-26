import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { LoginPage } from '@/pages/LoginPage';
import { BrowserRouter, NavigateFunction } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
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

// Mock react-router-dom
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: (): NavigateFunction => mockNavigate,
  };
});

// Helper to render LoginPage with all providers
function renderLoginPage(): void {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('should login successfully with valid credentials', async () => {
    // ARRANGE: Import the mocked axios
    const { apiClient } = await import('@/lib/axios');

    // Mock successful login response
    const mockLoginResponse = {
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: 'USER',
          isActive: true,
          createdAt: '2025-01-01T00:00:00.000Z',
        },
      },
    };

    // Tell the mock what to return when apiClient.post is called
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockLoginResponse);

    // Render the component
    renderLoginPage();

    // ACT: Simulate user interaction
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Type credentials
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Test1234!');

    // Click login
    await user.click(loginButton);

    // ASSERT: Check API was called correctly
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Test1234!',
      });
    });

    // Check refresh token was saved to localStorage
    expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
  });

  it('should show error message when login fails', async () => {
    // ARRANGE: Import the mocked axios
    const { apiClient } = await import('@/lib/axios');

    // Mock API error response
    const mockErrorResponse = {
      response: {
        status: 401,
        data: {
          error: 'Invalid credentials',
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValueOnce(mockErrorResponse);

    renderLoginPage();

    // ACT: Type and submit
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'WrongPass123!');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // ASSERT: Error message should appear
    const errorMessage = await screen.findByText(/Invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show loading state during login', async () => {
    const { apiClient } = await import('@/lib/axios');

    // Mock API with a delay (so we can check loading state)
    vi.mocked(apiClient.post).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: {
                accessToken: 'token',
                refreshToken: 'refresh',
                user: {
                  id: '1',
                  email: 'test@example.com',
                  role: 'USER',
                  isActive: true,
                  createdAt: '2025-01-01T00:00:00.000Z',
                },
              },
            });
          }, 100);
        })
    );

    renderLoginPage();

    const user = userEvent.setup();

    // Type and submit
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Test1234!');

    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);

    // ASSERT: Button should show "Logging in..." immediately after click
    expect(
      screen.getByRole('button', { name: /logging in/i })
    ).toBeInTheDocument();

    // ASSERT: Button should be disabled
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();

    // Wait for API call to complete (cleanup)
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
  });

  it('should disable from inputs during login', async () => {
    const { apiClient } = await import('@/lib/axios');

    // Mock API with delay
    vi.mocked(apiClient.post).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: {
                accessToken: 'token',
                refreshToken: 'refresh',
                user: {
                  id: '1',
                  email: 'test@example.com',
                  role: 'USER',
                  isActive: true,
                  createdAt: '2025-01-01T00:00:00.000Z',
                },
              },
            });
          }, 100);
        })
    );

    renderLoginPage();

    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Type and submit
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Test1234!');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // ASSERT: Input should be disabled during loading
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();

    // Cleanup: wait for API call
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
  });

  it('should have a link to register page', () => {
    renderLoginPage();

    // Find the register link by its text and role
    const registerLink = screen.getByRole('link', { name: /register/i });

    // Check it exists
    expect(registerLink).toBeInTheDocument();

    // Check it points to the right place
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('should navigate to dashboard after successful login', async () => {
    const { apiClient } = await import('@/lib/axios');

    // Mock successful login
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: {
        accessToken: 'token',
        refreshToken: 'refresh',
        user: {
          id: '1',
          email: 'test@example.com',
          role: 'USER',
          isAvtive: true,
          createAt: '2025-01-01T00:00:00.000Z',
        },
      },
    });

    renderLoginPage();

    const user = userEvent.setup();

    // Type and submit
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Test1234!');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Wait for login to complete
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    // ASSERT: navigate should have been called with '/dashboard'
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should redirect to dashboard if already authenticated', async () => {
    // Import useAuth
    const useAuthModule = await import('@/hooks/useAuth');

    // Spy on useAuth and mock its return value
    const spy = vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: {
        id: '1',
        email: 'test@example.com',
        role: UserRole.USER,
        isActive: true,
        createdAt: '2025-01-01T00:00:00.000Z',
      },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderLoginPage();

    // ASSERT: Should NOT see the login form
    expect(
      screen.queryByRole('button', { name: /login/i })
    ).not.toBeInTheDocument();

    // CLEANUP: Restore the original useAuth
    spy.mockRestore();
  });

  it('should require email and password fields', async () => {
    renderLoginPage();

    const user = userEvent.setup();

    const loginButton = screen.getByRole('button', { name: /login/i });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Try to submit empty form
    await user.click(loginButton);

    // ASSERT: From should be invalid (HTML5 validation)
    expect((emailInput as HTMLInputElement).validity.valid).toBe(false);
    expect((passwordInput as HTMLInputElement).validity.valid).toBe(false);

    // Now fill only email (password still empty)
    await user.type(emailInput, 'test@example.com');
    await user.click(loginButton);

    // Email should be valid now, password still invalid
    expect((emailInput as HTMLInputElement).validity.valid).toBe(true);
    expect((passwordInput as HTMLInputElement).validity.valid).toBe(false);
  });
});
