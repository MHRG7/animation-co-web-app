import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RegisterPage } from '@/pages/RegisterPage';
import { BrowserRouter, NavigateFunction } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { apiClient } from '@/lib/axios';
import { UserRole } from '@animation-co/shared-types';

vi.mock('@lib/axios', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
  setTokenGetter: vi.fn(),
  setTokenSetter: vi.fn(),
}));

// Mock react_router-dom
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: (): NavigateFunction => mockNavigate,
  };
});

// Helper to render RegisterPage with all providers
function renderRegisterPage(): void {
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
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('should register successfully with valid credentials', async () => {
    // ARRANGE: Import the mocked axios
    const { apiClient } = await import('@/lib/axios');

    // Mock successful register response
    const mockRegisterResponse = {
      data: {
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
    vi.mocked(apiClient.post).mockResolvedValueOnce(mockRegisterResponse);

    // Render the component
    renderRegisterPage();

    // ACT: Simulate user interaction
    const user = userEvent.setup();

    // Type credentials
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Test1234!');
    await user.type(screen.getByLabelText(/^confirm password$/i), 'Test1234!');

    // Click register
    await user.click(screen.getByRole('button', { name: /register/i }));

    // ASSERT: Check API was called correctly
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'Test1234!',
      });
    });

    // ASSERT: Success screen should appear
    const successMessage = await screen.findByText(/registeration successful/i);
    expect(successMessage).toBeInTheDocument();
  });

  it('should show error when password do not match', async () => {
    // ARRANGE: import the mocked axios
    const { apiClient } = await import('@/lib/axios');

    // Render the page
    renderRegisterPage();

    // ACT
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Test1234!');
    await user.type(
      screen.getByLabelText(/^confirm password$/i),
      'Somthing1234!'
    );

    // Click register
    await user.click(screen.getByRole('button', { name: /register/i }));

    // ASSERT: Password not match error should appear
    expect(
      await screen.findByText(/password do not match/i)
    ).toBeInTheDocument();

    // Api should not have been called
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should show error when email already exists', async () => {
    // ARRANGE: Mock API rejection with 409
    const mockErrorResponse = {
      response: {
        status: 409,
        data: {
          error: 'Email already exists', // This message apears in the UI
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValueOnce(mockErrorResponse);

    // Render Page
    renderRegisterPage();

    // ACT: Type matching password and submit
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Test1234!');
    await user.type(screen.getByLabelText(/^confirm password$/i), 'Test1234!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    // ASSERT: Error message should apear
    const errorMessage = await screen.findByText(/email already exists/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show error when password is too weak', async () => {
    // ARRANGE
    const { apiClient } = await import('@/lib/axios');

    renderRegisterPage();

    // ACT: Type weak password (no uppercase letter)
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'weakpassword123');
    await user.type(
      screen.getByLabelText(/^confirm password$/i),
      'weakpassword123'
    );

    await user.click(screen.getByRole('button', { name: /register/i }));

    // ASSERT: Zod error message apears (from frontend validation)
    const errorMessage = await screen.findByText(
      /password must contain at least one uppercase letter, one lowercase letter, and one number/i
    );

    expect(errorMessage).toBeInTheDocument();

    // ASSERT: API was NOT called (frontend validation stopped it)
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should show loading state during registration', async () => {
    // ARRANGE
    const { apiClient } = await import('@/lib/axios');

    // Mock API with a delay (so we can check loading state)
    vi.mocked(apiClient.post).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: {
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

    renderRegisterPage();

    // ACT: Type and submit
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Test1234!');
    await user.type(screen.getByLabelText(/^confirm password$/i), 'Test1234!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    // Assert: Button should show Creating account... and disabled
    expect(
      screen.getByRole('button', { name: /creating account/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /creating account/i })
    ).toBeDisabled();

    // ASSERT: All inputs are disabled
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeDisabled();

    // Cleanup: wait for API call to complete
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
  });

  it('should have a link to login page', () => {
    renderRegisterPage();

    // Find the login link by its text and role
    const loginLink = screen.getByRole('link', { name: /login/i });

    // Check it exists
    expect(loginLink).toBeInTheDocument();

    // Check it points to the right place
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should redirect to dashboard if already authenticated', async () => {
    // ARRANGE: Import useAuth
    const useAuthModule = await import('@/hooks/useAuth');

    // Spy on useAuth and mock it's return value
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

    renderRegisterPage();

    // ASSERT: Should NOT see the register form
    expect(
      screen.queryByRole('button', { name: /register/i })
    ).not.toBeInTheDocument();

    // CLEANUP: Restore the original useAuth
    spy.mockRestore();
  });
});
