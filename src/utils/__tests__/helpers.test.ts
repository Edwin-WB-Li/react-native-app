import { sleep, formatDate, truncateString, isValidEmail, validatePassword } from '../helpers';

describe('helpers', () => {
  describe('sleep', () => {
    it('resolves after specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(90);
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('01');
      expect(result).toContain('15');
    });

    it('formats date string correctly', () => {
      const result = formatDate('2024-06-20');
      expect(result).toContain('2024');
      expect(result).toContain('06');
      expect(result).toContain('20');
    });
  });

  describe('truncateString', () => {
    it('returns original string if within max length', () => {
      const result = truncateString('hello', 10);
      expect(result).toBe('hello');
    });

    it('truncates string and adds ellipsis if too long', () => {
      const result = truncateString('hello world', 5);
      expect(result).toBe('hello...');
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.jp')).toBe(true);
    });

    it('returns false for invalid email', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns valid for password with 6+ characters', () => {
      const result = validatePassword('123456');
      expect(result.valid).toBe(true);
    });

    it('returns invalid for password with less than 6 characters', () => {
      const result = validatePassword('12345');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('密码长度至少为 6 位');
    });
  });
});
