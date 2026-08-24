import { sleep, formatDate, truncateString } from '../helpers';

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
});
