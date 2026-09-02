import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CartScreen from '../index';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';

jest.mock('@/services/queries/useProducts', () => ({
  useProducts: () => ({ data: [], isLoading: false, isError: false, error: null }),
}));

jest.mock('expo-image', () => ({
  Image: () => null,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return Wrapper;
};

describe('CartScreen auth guard', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
    useCartStore.setState({ items: [] } as never);
  });

  it('shows login prompt when user is not authenticated', () => {
    render(<CartScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('请先登录')).toBeTruthy();
    expect(screen.getByText('登录后才能查看购物车')).toBeTruthy();
    expect(screen.getByText('去登录')).toBeTruthy();
  });

  it('shows empty cart when user is authenticated but cart is empty', () => {
    useAuthStore.setState({
      user: { id: 1, name: 'Test', email: 'test@example.com' },
      isAuthenticated: true,
      error: null,
      isLoading: false,
    });
    render(<CartScreen />, { wrapper: createWrapper() });
    expect(screen.getByText('购物车是空的')).toBeTruthy();
  });
});
