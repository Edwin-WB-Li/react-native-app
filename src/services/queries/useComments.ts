import { useQuery } from '@tanstack/react-query';
import { commentsApi } from '@/services/api/comments';
import { Comment } from '#/models';

export const useComments = (postId: number) => {
  return useQuery<Comment[], Error>({
    queryKey: ['comments', postId],
    queryFn: () => commentsApi.getByPostId(postId),
    enabled: !!postId,
  });
};
