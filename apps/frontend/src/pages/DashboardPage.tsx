import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export function DashboardPage(): React.JSX.Element {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-4">welcome, {user?.email}!</p>
          <p className="text-sm text-gray-500 mb-4">Role: {user?.role}</p>
          <button
            onClick={() => logout()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
