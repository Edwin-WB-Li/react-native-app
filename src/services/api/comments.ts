import apiClient from './client';
import { Comment } from '@/models';

export const commentsApi = {
  getByPostId: async (postId: number): Promise<Comment[]> => {
    const { data } = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
    return data;
  },
};
