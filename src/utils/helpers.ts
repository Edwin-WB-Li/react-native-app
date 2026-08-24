export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const truncateString = (str: string, maxLength: number): string => {
  if (maxLength <= 0) return str;
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};
