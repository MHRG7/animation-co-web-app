import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { NavigateProps } from 'react-router-dom';
import { createElement } from 'react';

// A Spy to caprute Navigate props
const mockNavigateProps = vi.fn();

// Mock react-router-dom, keeping most exports but replacing Navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const ActualNavigate = actual['Navigate'] as React.FC<NavigateProps>;
  return {
    ...actual, // Keep all actual exports (MemoryRouter, Routes, etc.)
    Navigate: (props: NavigateProps): React.ReactElement => {
      mockNavigateProps(props); // Capture the props
      return createElement(ActualNavigate, props);
    },
  };
});

import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@animation-co/shared-types';

vi.mock('@/hooks/useAuth');

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigateProps.mockClear();
  });

  it('shows loading state while checking authentication', () => {
    // Mock useAuth to return loading state
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Should show loading text
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Should NOT show protected content yet
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    // Mock useAuth: NOT loading, NOT authenticated
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          {/* Protected route */}
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret Dashboard</div>
              </ProtectedRoute>
            }
          />
          {/* Login route */}
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: {
        id: '1',
        email: 'test@example.com',
        role: UserRole.USER,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      isLoading: false,
      isAuthenticated: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('uses replace navigation to prevent back button issues', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Secret Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Verify Navigate was rendered with replace: true
    expect(mockNavigateProps).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/login',
        replace: true,
      })
    );
  });
});
