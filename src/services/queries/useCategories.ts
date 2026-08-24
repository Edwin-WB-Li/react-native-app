import { useQuery } from '@tanstack/react-query';
import { Category } from '#/models';
import { categoriesApi } from '@/services/api/products';

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });
};

export const useCategory = (id: number) => {
  return useQuery<Category | undefined, Error>({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
};
