import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when user tabs back
      staleTime: 5 * 60 * 1000, // Data i fresh for 5 minutes
    },
  },
});
