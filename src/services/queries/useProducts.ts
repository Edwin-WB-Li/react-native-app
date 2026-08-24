import { useQuery } from '@tanstack/react-query';
import { Product } from '#/models';
import { productsApi } from '@/services/api/products';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
};

export const useProduct = (id: number) => {
  return useQuery<Product | undefined, Error>({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (categoryId: number) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => productsApi.getByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useFlashSaleProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'flashSale'],
    queryFn: productsApi.getFlashSale,
  });
};

export const useRecommendedProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products', 'recommended'],
    queryFn: productsApi.getRecommended,
  });
};

export const useBanners = () => {
  return useQuery<{ id: number; image: string; link: string }[], Error>({
    queryKey: ['banners'],
    queryFn: productsApi.getBanners,
  });
};
