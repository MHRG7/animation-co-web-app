import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@animation-co/shared-types';
import { DashboardPage } from '@/pages/DashboardPage';
import userEvent from '@testing-library/user-event';

vi.mock('@/hooks/useAuth');

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays user email, role and logout button', () => {
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

    render(<DashboardPage />);

    expect(screen.getByText(/welcome, test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Role: user/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', async () => {
    const mockLogout = vi.fn();

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
      logout: mockLogout,
    });

    render(<DashboardPage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
