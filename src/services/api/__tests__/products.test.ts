import { productsApi, categoriesApi, searchApi } from '../products';
import { products, categories, banners, hotSearchKeywords } from '../mockData';

describe('productsApi', () => {
  describe('getAll', () => {
    it('should return all products', async () => {
      const result = await productsApi.getAll();
      expect(result).toHaveLength(products.length);
      expect(result[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(Number),
      });
    });

    it('should return a copy of products, not the original array', async () => {
      const result = await productsApi.getAll();
      result.push({} as typeof result[0]);
      const second = await productsApi.getAll();
      expect(second).toHaveLength(products.length);
    });
  });

  describe('getById', () => {
    it('should return the product with matching id', async () => {
      const result = await productsApi.getById(1);
      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('ProMax 智能手机');
    });

    it('should return undefined for non-existent id', async () => {
      const result = await productsApi.getById(99999);
      expect(result).toBeUndefined();
    });
  });

  describe('getByCategory', () => {
    it('should return products in the specified sub-category', async () => {
      const result = await productsApi.getByCategory(101);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(p => p.categoryId === 101)).toBe(true);
    });

    it('should return products from all children when given a parent category', async () => {
      const result = await productsApi.getByCategory(1);
      expect(result.length).toBeGreaterThan(0);
      // 手机数码(id=1)下有4个子分类，商品categoryId应该是子分类ID
      expect(result.some(p => p.categoryId === 101)).toBe(true);
      expect(result.some(p => p.categoryId === 102)).toBe(true);
    });

    it('should return empty array for category with no products', async () => {
      const result = await productsApi.getByCategory(99999);
      expect(result).toEqual([]);
    });
  });

  describe('search', () => {
    it('should return products matching the keyword', async () => {
      const result = await productsApi.search('手机');
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(p => p.name.includes('手机'))).toBe(true);
    });

    it('should be case-insensitive', async () => {
      const lowerResult = await productsApi.search('phone');
      const upperResult = await productsApi.search('PHONE');
      expect(lowerResult.length).toBe(upperResult.length);
    });

    it('should return empty array for empty keyword', async () => {
      const result = await productsApi.search('');
      expect(result).toEqual([]);
    });

    it('should search in tags', async () => {
      const result = await productsApi.search('爆款');
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(p => p.tags?.includes('爆款'))).toBe(true);
    });
  });

  describe('getFlashSale', () => {
    it('should return only flash sale products', async () => {
      const result = await productsApi.getFlashSale();
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(p => p.isFlashSale)).toBe(true);
    });
  });

  describe('getRecommended', () => {
    it('should return products with high sales', async () => {
      const result = await productsApi.getRecommended();
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(8);
      expect(result.every(p => p.sales > 5000)).toBe(true);
    });
  });

  describe('getBanners', () => {
    it('should return all banners', async () => {
      const result = await productsApi.getBanners();
      expect(result).toHaveLength(banners.length);
      expect(result[0]).toHaveProperty('image');
      expect(result[0]).toHaveProperty('link');
    });
  });
});

describe('categoriesApi', () => {
  describe('getAll', () => {
    it('should return all categories with children', async () => {
      const result = await categoriesApi.getAll();
      expect(result).toHaveLength(categories.length);
      expect(result[0].children).toBeDefined();
      expect(result[0].children!.length).toBeGreaterThan(0);
    });
  });

  describe('getById', () => {
    it('should return top-level category by id', async () => {
      const result = await categoriesApi.getById(1);
      expect(result).toBeDefined();
      expect(result?.name).toBe('手机数码');
    });

    it('should return child category by id', async () => {
      const result = await categoriesApi.getById(101);
      expect(result).toBeDefined();
      expect(result?.name).toBe('手机');
      expect(result?.parentId).toBe(1);
    });

    it('should return undefined for non-existent id', async () => {
      const result = await categoriesApi.getById(99999);
      expect(result).toBeUndefined();
    });
  });
});

describe('searchApi', () => {
  describe('getHotKeywords', () => {
    it('should return hot search keywords', async () => {
      const result = await searchApi.getHotKeywords();
      expect(result).toEqual(hotSearchKeywords);
    });
  });

  describe('getSuggestions', () => {
    it('should return matching suggestions', async () => {
      const result = await searchApi.getSuggestions('手');
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(k => k.includes('手'))).toBe(true);
    });

    it('should return empty array for empty keyword', async () => {
      const result = await searchApi.getSuggestions('');
      expect(result).toEqual([]);
    });
  });
});
