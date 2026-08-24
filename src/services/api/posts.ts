import apiClient from './client';
import { Post } from '@/models';

export const postsApi = {
  getAll: async (): Promise<Post[]> => {
    const { data } = await apiClient.get<Post[]>('/posts');
    return data;
  },

  getById: async (id: number): Promise<Post> => {
    const { data } = await apiClient.get<Post>(`/posts/${id}`);
    return data;
  },
};
