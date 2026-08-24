import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/services/api/posts';
import { Post } from '#/models';

export const usePosts = () => {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: postsApi.getAll,
  });
};

export const usePost = (id: number) => {
  return useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: () => postsApi.getById(id),
    enabled: !!id,
  });
};
