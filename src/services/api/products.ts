import { Product, Category } from '#/models';
import { products, categories, banners, hotSearchKeywords } from './mockData';

const DELAY = 300;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    await delay(DELAY);
    return [...products];
  },

  getById: async (id: number): Promise<Product | undefined> => {
    await delay(DELAY);
    return products.find(p => p.id === id);
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    await delay(DELAY);

    // 收集目标分类ID：包含自身及其所有子分类
    const targetIds = new Set<number>([categoryId]);

    const parentCategory = categories.find(c => c.id === categoryId);
    if (parentCategory?.children) {
      parentCategory.children.forEach(child => targetIds.add(child.id));
    }

    return products.filter(p => targetIds.has(p.categoryId));
  },

  search: async (keyword: string): Promise<Product[]> => {
    await delay(DELAY);
    if (!keyword.trim()) return [];
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(lowerKeyword) ||
        p.description.toLowerCase().includes(lowerKeyword) ||
        p.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  },

  getFlashSale: async (): Promise<Product[]> => {
    await delay(DELAY);
    return products.filter(p => p.isFlashSale);
  },

  getRecommended: async (): Promise<Product[]> => {
    await delay(DELAY);
    return products.filter(p => p.sales > 5000).slice(0, 8);
  },

  getBanners: async (): Promise<typeof banners> => {
    await delay(100);
    return [...banners];
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    await delay(DELAY);
    return [...categories];
  },

  getById: async (id: number): Promise<Category | undefined> => {
    await delay(DELAY);
    const findInTree = (cats: Category[]): Category | undefined => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.children) {
          const found = findInTree(cat.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findInTree(categories);
  },
};

export const searchApi = {
  getHotKeywords: async (): Promise<string[]> => {
    await delay(100);
    return [...hotSearchKeywords];
  },

  getSuggestions: async (keyword: string): Promise<string[]> => {
    await delay(200);
    if (!keyword.trim()) return [];
    const lowerKeyword = keyword.toLowerCase();
    return hotSearchKeywords.filter(k => k.toLowerCase().includes(lowerKeyword));
  },
};
