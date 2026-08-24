import { useQuery } from '@tanstack/react-query';
import { Product } from '#/models';
import { productsApi, searchApi } from '@/services/api/products';

export const useSearchProducts = (keyword: string) => {
  return useQuery<Product[], Error>({
    queryKey: ['search', keyword],
    queryFn: () => productsApi.search(keyword),
    enabled: !!keyword.trim(),
  });
};

export const useHotKeywords = () => {
  return useQuery<string[], Error>({
    queryKey: ['hotKeywords'],
    queryFn: searchApi.getHotKeywords,
  });
};

export const useSearchSuggestions = (keyword: string) => {
  return useQuery<string[], Error>({
    queryKey: ['suggestions', keyword],
    queryFn: () => searchApi.getSuggestions(keyword),
    enabled: !!keyword.trim(),
  });
};
