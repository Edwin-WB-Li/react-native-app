import { commentsApi } from '../comments';
import apiClient from '../client';

jest.mock('../client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('commentsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getByPostId', () => {
    it('fetches comments for a specific post', async () => {
      const mockComments = [
        {
          postId: 1,
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          body: 'This is a test comment',
        },
        {
          postId: 1,
          id: 2,
          name: 'Another User',
          email: 'another@example.com',
          body: 'Another test comment',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockComments });

      const result = await commentsApi.getByPostId(1);

      expect(apiClient.get).toHaveBeenCalledTimes(1);
      expect(apiClient.get).toHaveBeenCalledWith('/posts/1/comments');
      expect(result).toEqual(mockComments);
      expect(result).toHaveLength(2);
    });

    it('returns empty array when post has no comments', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await commentsApi.getByPostId(999);

      expect(apiClient.get).toHaveBeenCalledWith('/posts/999/comments');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
