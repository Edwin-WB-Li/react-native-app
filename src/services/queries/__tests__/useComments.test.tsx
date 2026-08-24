import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useComments } from '../useComments';
import { commentsApi } from '@/services/api/comments';

jest.mock('@/services/api/comments');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useComments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns comments data on success', async () => {
    const mockComments = [
      {
        postId: 1,
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        body: 'Great post!',
      },
    ];

    (commentsApi.getByPostId as jest.Mock).mockResolvedValue(mockComments);

    const { result } = renderHook(() => useComments(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockComments);
    expect(commentsApi.getByPostId).toHaveBeenCalledWith(1);
  });

  it('returns empty array when post has no comments', async () => {
    (commentsApi.getByPostId as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useComments(99), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(result.current.data).toHaveLength(0);
  });

  it('does not fetch when postId is 0', () => {
    (commentsApi.getByPostId as jest.Mock).mockResolvedValue([]);

    renderHook(() => useComments(0), {
      wrapper: createWrapper(),
    });

    expect(commentsApi.getByPostId).not.toHaveBeenCalled();
  });

  it('returns error state when API fails', async () => {
    (commentsApi.getByPostId as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useComments(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
