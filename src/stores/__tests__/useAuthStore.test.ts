import { useAuthStore } from '../useAuthStore';
import { User } from '#/models';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  });

  describe('initial state', () => {
    it('should have user as null', () => {
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('should have isAuthenticated as false', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should have error as null', () => {
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('login', () => {
    it('should set user and isAuthenticated on successful login', () => {
      const mockUser: User = {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        avatar: 'https://example.com/avatar.jpg',
      };

      useAuthStore.getState().login(mockUser);

      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().error).toBeNull();
    });

    it('should clear previous error on login', () => {
      useAuthStore.setState({ error: 'Previous error' });
      const mockUser: User = { id: 1, name: '张三', email: 'zhangsan@example.com' };
      useAuthStore.getState().login(mockUser);
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear user and set isAuthenticated to false', () => {
      const mockUser: User = { id: 1, name: '张三', email: 'zhangsan@example.com' };
      useAuthStore.getState().login(mockUser);
      useAuthStore.getState().logout();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('should create a new user and log them in', () => {
      useAuthStore.getState().register('李四', 'lisi@example.com', 'password123');

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user).toMatchObject({
        name: '李四',
        email: 'lisi@example.com',
      });
      expect(useAuthStore.getState().user?.id).toBeDefined();
    });

    it('should clear previous error on register', () => {
      useAuthStore.setState({ error: 'Previous error' });
      useAuthStore.getState().register('李四', 'lisi@example.com', 'password123');
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      useAuthStore.getState().setError('Invalid credentials');
      expect(useAuthStore.getState().error).toBe('Invalid credentials');
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      useAuthStore.setState({ error: 'Some error' });
      useAuthStore.getState().clearError();
      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
